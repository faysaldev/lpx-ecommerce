const httpStatus = require("http-status");
const {
  User,
  Product,
  Order,
  Rating,
  Vendor,
  Cart,
  Notification,
  Wishlist,
} = require("../models");
const moment = require("moment");

// Get Featured Products based on ratings, sales, and orders

const getFeturedProducts = async () => {
  // Step 1: Try to fetch featured products (by rating + order count)
  const featuredProducts = await Product.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "referenceId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "totalItems.productId",
        as: "orders",
      },
    },
    {
      $addFields: {
        averageRating: { $avg: "$ratings.rating" },
        totalOrders: { $size: "$orders" },
      },
    },
    {
      $sort: { totalOrders: -1, averageRating: -1, createdAt: -1 },
    },
    {
      $limit: 4,
    },
    {
      $project: {
        productName: 1,
        price: 1,
        stockQuantity: 1,
        condition: 1,
        images: 1,
        category: 1,
        vendor: 1,
        averageRating: 1,
        totalOrders: 1,
      },
    },
  ]);

  // Step 2: If no products with ratings or orders, fallback to latest products
  if (featuredProducts.length === 0) {
    const newProducts = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .select(
        "productName price stockQuantity condition images category vendor"
      )
      .lean();

    return newProducts;
  }

  // Step 3: Ensure no duplicate products (edge safety)
  const uniqueProducts = [];
  const seen = new Set();

  for (const product of featuredProducts) {
    if (!seen.has(product._id.toString())) {
      seen.add(product._id.toString());
      uniqueProducts.push(product);
    }
  }

  // Step 4: If fewer than 4 featured products, fill with newest products
  if (uniqueProducts.length < 4) {
    const remaining = await Product.find({
      _id: { $nin: Array.from(seen) },
    })
      .sort({ createdAt: -1 })
      .limit(4 - uniqueProducts.length)
      .select(
        "productName price stockQuantity condition images category vendor"
      )
      .lean();

    uniqueProducts.push(...remaining);
  }

  return uniqueProducts;
};

const getLpsStatistics = async () => {
  // Monthly Volume (Total amount of orders delivered in the current month)
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  const monthlyVolumeResult = await Order.aggregate([
    {
      $match: {
        status: "delivered",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, totalVolume: { $sum: "$totalAmount" } } },
  ]);

  const monthlyVolume =
    monthlyVolumeResult.length > 0 ? monthlyVolumeResult[0].totalVolume : 0;

  // Listed Items (Total number of products in the database)
  const listedItems = await Product.countDocuments();

  // Active Users (Users who made at least one purchase in the last 30 days)
  const activeUsers = await User.countDocuments({
    _id: {
      $in: await Order.distinct("customer", {
        createdAt: { $gte: moment().subtract(30, "days").toDate() },
      }),
    },
  });

  // Satisfaction (Average rating of all products)
  const ratingsResult = await Rating.aggregate([
    { $match: { ratingType: "product" } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const satisfaction =
    ratingsResult.length > 0 ? ratingsResult[0].averageRating : 0;

  return {
    monthlyVolume: `$${monthlyVolume.toLocaleString()}`,
    listedItems: `${listedItems.toLocaleString()}`,
    activeUsers: `${activeUsers.toLocaleString()}`,
    satisfaction: `${satisfaction.toFixed(1)}%`,
  };
};

const hasUserPurchased = async ({ userId, entityId, type }) => {
  if (!["vendor", "product"].includes(type)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Invalid type, must be 'vendor' or 'product'"
    );
  }

  let query = { customer: userId }; // Filter by user (customer)

  if (type === "product") {
    // If type is 'product', we check if the productId exists in the totalItems
    query = {
      ...query,
      "totalItems.productId": entityId, // Check if the productId exists in totalItems
    };
  } else if (type === "vendor") {
    // If type is 'vendor', we check if the vendorId exists in the totalItems
    query = {
      ...query,
      "totalItems.vendorId": entityId, // Check if the vendorId exists in totalItems
    };
  }

  // Find matching orders based on the query
  const order = await Order.findOne(query).lean();

  // If the order exists, it means the user has purchased from the specified product/vendor
  return !!order; // Return true if an order is found, otherwise false
};

// header Statitics
const headerStatistics = async (userId) => {
  try {
    // Fetch all unread notifications for the user (authorId == userId and isRead == false)
    const unreadNotifications = await Notification.find({
      authorId: userId,
      isRead: false,
    }).lean();

    // Fetch all cart items for the user (customer == userId)
    const cartItems = await Cart.find({ customer: userId }).lean();

    // Fetch all wishlist items for the user (customer == userId)
    const wishlistItems = await Wishlist.find({ customer: userId }).lean();

    // Return statistics
    return {
      unreadNotificationsCount: unreadNotifications.length,
      cartItemsCount: cartItems.length,
      wishlistItemsCount: wishlistItems.length,
    };
  } catch (error) {
    console.error("Error fetching header statistics:", error);
    throw new Error("Error fetching header statistics");
  }
};
// get customer dashboard details
const getCustomerDashboard = async (userId) => {
  // Get basic stats
  const totalOrders = await Order.countDocuments({
    customer: userId,
    status: { $ne: "unpaid" },
  });
  const totalWishlistItems = await Product.countDocuments({ wishlist: userId }); // Assuming Product model has a `wishlist` array of userIds
  const totalReviews = await Rating.countDocuments({ author: userId });

  // Get user join date
  const user = await User.findById(userId).select("createdAt name").lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get recent 4-5 orders
  const recentOrders = await Order.find({
    customer: userId,
    status: { $ne: "unpaid" },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .select("orderID totalAmount status createdAt")
    .lean();

  // Format recent orders
  const formattedOrders = recentOrders.map((order) => ({
    orderId: order.orderID,
    orderMongoId: order._id,
    price: order.totalAmount,
    status: order.status,
    orderDate: order.createdAt,
  }));

  return {
    stats: {
      totalOrders,
      totalWishlistItems,
      totalReviews,
      joinedAt: user.createdAt,
    },
    recentOrders: formattedOrders,
  };
};

// VendorDashboardOverView
// const vendorDashboardOverview = async (userId) => {
//   if (!userId) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
//   }

//   // Get vendor details
//   const vendor = await Vendor.findOne({ seller: userId });
//   if (!vendor) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
//   }

//   // Total Sales (Sum of totalAmount from orders)
//   const totalSales = await Order.aggregate([
//     { $match: { vendorId: vendor._id, status: "delivered" } },
//     { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
//   ]);

//   // Total Orders
//   const totalOrders = await Order.countDocuments({ vendorId: vendor._id });

//   // Active Products (products with stock > 0)
//   const activeProducts = await Product.countDocuments({
//     vendor: vendor._id,
//     stockQuantity: { $gt: 0 },
//   });

//   // Total Customers (number of distinct customers who have purchased from this vendor)
//   const customers = await Order.distinct("customer", { vendorId: vendor._id });

//   // Recent Orders
//   const recentOrders = await Order.find({ vendorId: vendor._id })
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .populate({
//       path: "customer",
//       select: "name image", // Get user details
//     })
//     .lean();

//   // Format recent orders
//   const formattedRecentOrders = recentOrders.map((order) => ({
//     orderId: order.orderID,
//     orderMongoId: order._id,
//     userName: order.customer.name,
//     userImage: order.customer.image,
//     price: order.totalAmount,
//     status: order.status,
//     orderDate: order.createdAt,
//   }));

//   return {
//     stats: {
//       totalSales: totalSales[0]?.totalSales || 0,
//       totalOrders,
//       activeProducts,
//       totalCustomers: customers.length,
//       storeStatus: vendor.status,
//     },
//     recentOrders: formattedRecentOrders,
//   };
// };

const vendorDashboardOverview = async (userId) => {
  if (!userId) {
    return httpStatus.BAD_REQUEST, "User ID is required";
  }

  // Get vendor details
  const vendor = await Vendor.findOne({ seller: userId });
  if (!vendor) {
    return httpStatus.NOT_FOUND, "Vendor not found";
  }

  // Total Sales (Sum of totalAmount from orders, excluding 'unpaid' status)
  const totalSales = await Order.aggregate([
    {
      $match: { "totalItems.vendorId": vendor._id, status: { $ne: "unpaid" } },
    }, // Exclude "unpaid"
    { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
  ]);

  // Total Orders (Excluding "unpaid" status)
  const totalOrders = await Order.countDocuments({
    "totalItems.vendorId": vendor._id,
    status: { $ne: "unpaid" }, // Exclude "unpaid"
  });

  // Active Products (products with stock > 0)
  const activeProducts = await Product.countDocuments({
    vendor: vendor._id,
    stockQuantity: { $gt: 0 },
  });

  // Total Customers (number of distinct customers who have purchased from this vendor)
  const customers = await Order.distinct("customer", {
    "totalItems.vendorId": vendor._id,
    status: { $ne: "unpaid" }, // Exclude "unpaid"
  });

  // Recent Orders (excluding "unpaid" orders, limit to 4)
  const recentOrders = await Order.find({
    "totalItems.vendorId": vendor._id,
    status: { $ne: "unpaid" }, // Exclude "unpaid"
  })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate({
      path: "customer",
      select: "name image", // Get user details
    })
    .lean();

  // Format recent orders
  const formattedRecentOrders = recentOrders.map((order) => ({
    orderId: order.orderID,
    orderMongoId: order._id,
    userName: order.customer.name,
    userImage: order.customer.image,
    price: order.totalAmount,
    status: order.status,
    orderDate: order.createdAt,
  }));

  return {
    stats: {
      totalSales: totalSales[0]?.totalSales || 0,
      totalOrders,
      activeProducts,
      totalCustomers: customers.length,
      storeStatus: vendor.status,
    },
    recentOrders: formattedRecentOrders,
  };
};

const getVendorRecentOrders = async (userId, page = 1, limit = 10) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor ID is required");
  }

  // Fetch the vendor's ID based on the userId
  const vendor = await Vendor.findOne({ seller: userId });

  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  const vendorId = vendor._id; // Assuming the vendor ID is in vendor._id

  const skip = (page - 1) * limit;

  // Find orders where the vendorId matches any product's vendorId inside totalItems
  const recentOrders = await Order.find({
    "totalItems.vendorId": vendorId,
    status: { $ne: "unpaid" },
  })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("customer", "name image type") // Populate customer details
    .lean();

  const totalOrders = await Order.countDocuments({
    "totalItems.vendorId": vendorId,
    status: { $ne: "unpaid" },
  }); // Count orders with the vendorId in totalItems
  const totalPages = Math.ceil(totalOrders / limit);

  const formattedOrders = recentOrders.map((order) => ({
    orderId: order.orderID,
    userName: order.customer.name,
    userImage: order.customer.image,
    userType: order.customer.type,
    totalPrice: order.totalAmount,
    status: order.status,
    orderDate: order.createdAt,
    orderMongoId: order._id,
  }));

  return {
    orders: formattedOrders,
    totalOrders,
    totalPages,
  };
};

const getVendorProducts = async (
  userId,
  { search = "", status = "", sortBy = "newestFirst", page = 1, limit = 10 }
) => {
  const skip = (page - 1) * limit;

  const vendorId = await Vendor.findOne({ seller: userId });

  console.log(vendorId);
  // Build the search query for products
  const searchQuery = { vendor: vendorId?._id };

  // Apply filters for product name, category, and status
  if (search) {
    searchQuery.$or = [
      { productName: { $regex: search, $options: "i" } }, // Search by product name
      { category: { $regex: search, $options: "i" } }, // Search by category
    ];
  }

  if (status) {
    searchQuery.status = status; // Filter by product status (active, draft, out of stock)
  }

  // Sorting logic based on the `sortBy` parameter
  let sortOrder = {};
  switch (sortBy) {
    case "newestFirst":
      sortOrder = { createdAt: -1 }; // Newest first
      break;
    case "lowToHigh":
      sortOrder = { price: 1 }; // Low to high price
      break;
    case "highToLow":
      sortOrder = { price: -1 }; // High to low price
      break;
    default:
      sortOrder = { createdAt: -1 }; // Default: Newest first
  }

  try {
    // Fetch filtered and sorted products
    const products = await Product.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .select("productName images category price stockQuantity status")
      .populate({
        path: "vendor",
        select: "storeName", // Optionally populate vendor's store name
      })
      .sort(sortOrder)
      .lean();

    // Get the total number of products for pagination
    const totalProducts = await Product.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      products,
      totalProducts,
      totalPages,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching products"
    );
  }
};

module.exports = {
  getFeturedProducts,
  getLpsStatistics,
  hasUserPurchased,
  getCustomerDashboard,
  vendorDashboardOverview,
  getVendorRecentOrders,
  getVendorProducts,
  headerStatistics,
};
