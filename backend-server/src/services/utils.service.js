const httpStatus = require("http-status");
const { User, Product, Order, Rating, Vendor } = require("../models");
const moment = require("moment");

// Get Featured Products based on ratings, sales, and orders
const getFeturedProducts = async () => {
  // Fetch products sorted by rating and total sales (number of orders)
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
      $project: {
        productName: 1,
        price: 1,
        stockQuantity: 1,
        condition: 1,
        images: 1,
        category: 1,
        vendor: 1,
        rating: { $avg: "$ratings.rating" }, // Average rating
        totalOrders: { $size: "$orders" }, // Total number of orders
      },
    },
    { $sort: { rating: -1, totalOrders: -1 } }, // Sort by rating and orders
    { $limit: 6 }, // Fetch top 6 products
  ]);

  // If there are fewer than 4 featured products, add new products
  if (featuredProducts.length < 4) {
    const remainingProducts = await Product.find({})
      .skip(0) // You can adjust this based on your logic
      .limit(4 - featuredProducts.length)
      .select(
        "productName price stockQuantity condition images category vendor"
      )
      .lean();

    // Add the remaining products to the featured products list
    return [...featuredProducts, ...remainingProducts];
  }

  return featuredProducts;
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

// get customer dashboard details
const getCustomerDashboard = async (userId) => {
  // Get basic stats
  const totalOrders = await Order.countDocuments({ customer: userId });
  const totalWishlistItems = await Product.countDocuments({ wishlist: userId }); // Assuming Product model has a `wishlist` array of userIds
  const totalReviews = await Rating.countDocuments({ author: userId });

  // Get user join date
  const user = await User.findById(userId).select("createdAt name").lean();
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Get recent 4-5 orders
  const recentOrders = await Order.find({ customer: userId })
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
const vendorDashboardOverview = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User ID is required");
  }

  // Get vendor details
  const vendor = await Vendor.findOne({ seller: userId });
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  // Total Sales (Sum of totalAmount from orders)
  const totalSales = await Order.aggregate([
    { $match: { vendorId: vendor._id, status: "delivered" } },
    { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
  ]);

  // Total Orders
  const totalOrders = await Order.countDocuments({ vendorId: vendor._id });

  // Active Products (products with stock > 0)
  const activeProducts = await Product.countDocuments({
    vendor: vendor._id,
    stockQuantity: { $gt: 0 },
  });

  // Total Customers (number of distinct customers who have purchased from this vendor)
  const customers = await Order.distinct("customer", { vendorId: vendor._id });

  // Recent Orders
  const recentOrders = await Order.find({ vendorId: vendor._id })
    .sort({ createdAt: -1 })
    .limit(5)
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

const getVendorRecentOrders = async (vendorId, page = 1, limit = 10) => {
  if (!vendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor ID is required");
  }

  const skip = (page - 1) * limit;

  const recentOrders = await Order.find({ vendorId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate("customer", "name image type") // Populate customer details
    .lean();

  const totalOrders = await Order.countDocuments({ vendorId });
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
  vendorId,
  { search = "", status = "", sortBy = "newestFirst", page = 1, limit = 10 }
) => {
  if (!vendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor ID is required");
  }

  const skip = (page - 1) * limit;

  // Build the search query for products
  const searchQuery = { vendor: vendorId };

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
};
