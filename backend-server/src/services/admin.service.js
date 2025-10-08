const httpStatus = require("http-status");
const {
  User,
  Vendor,
  Product,
  Order,
  Category,
  PaymentRequest,
} = require("../models");
const ApiError = require("../utils/ApiError");

const getAllUsers = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return User.find();
};

const getAllVendors = async (query) => {
  const { status, search, page = 1, limit = 10 } = query;
  let filter = {};

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { storeName: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
    ];
  }

  try {
    const vendors = await Vendor.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });
    const totalCount = await Vendor.countDocuments(filter);

    return {
      vendors,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching vendors"
    );
  }
};

const updateVendor = async (query) => {
  if (!query) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  console.log(query);

  await Vendor.findByIdAndUpdate(query?.id, {
    status: query?.status,
    notes: query?.notes,
  });

  await User.findByIdAndUpdate(query?.seller, { type: "seller" });

  // TODO: here i have to update the user type to customer
  // await User.findByIdAndUpdate(query?.userId, {});
  return "updated done";
};

const getAdminDashboardData = async () => {
  // Get platform statistics
  const totalUsers = await User.countDocuments({ isDeleted: false });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenue = await Order.aggregate([
    { $match: { status: "delivered" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const activeVendors = await Vendor.countDocuments({ status: "approved" });
  const pendingApprovals = await Vendor.countDocuments({ status: "pending" });

  // Get users' monthly change percentage
  const lastMonthUsers = await User.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
  });
  const usersChange = ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;

  // Get products' monthly change percentage
  const lastMonthProducts = await Product.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
  });
  const productsChange =
    ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100;

  // Get orders' monthly change percentage
  const lastMonthOrders = await Order.countDocuments({
    createdAt: {
      $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    },
  });
  const ordersChange =
    ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100;

  // Get revenue change percentage
  const lastMonthRevenue = await Order.aggregate([
    {
      $match: {
        status: "delivered",
        createdAt: {
          $gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
  ]);
  const revenueChange =
    (((totalRevenue[0]?.totalRevenue || 0) -
      (lastMonthRevenue[0]?.totalRevenue || 0)) /
      (lastMonthRevenue[0]?.totalRevenue || 1)) *
    100;

  // Get top vendors by sales
  const topVendors = await Vendor.aggregate([
    { $match: { status: "approved" } },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "vendorId",
        as: "orders",
      },
    },
    {
      $project: {
        storeName: 1,
        totalSales: { $sum: "$orders.totalAmount" },
      },
    },
    { $sort: { totalSales: -1 } },
    { $limit: 5 },
  ]);

  // Get recent activities for today from different models (Order, Vendor, Product)
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  // Get recent Orders placed today
  const recentOrders = await Order.find({ createdAt: { $gte: startOfDay } })
    .select("orderID status totalAmount createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent Product additions today
  const recentProducts = await Product.find({ createdAt: { $gte: startOfDay } })
    .select("productName category createdAt")
    .sort({ createdAt: -1 })
    .limit(5);

  // Get recent Vendor updates today (e.g., new approvals or status changes)
  const recentVendors = await Vendor.find({ updatedAt: { $gte: startOfDay } })
    .select("storeName status createdAt updatedAt")
    .sort({ updatedAt: -1 })
    .limit(5);

  // Combine recent activities (Order, Product, Vendor)
  const recentActivities = [
    ...recentOrders.map((order) => ({
      type: "Order",
      action: `Order #${order.orderID} placed`,
      details: `Status: ${order.status}, Amount: $${order.totalAmount}`,
      time: order.createdAt,
    })),
    ...recentProducts.map((product) => ({
      type: "Product",
      action: `New product added: ${product.productName}`,
      details: `Category: ${product.category}`,
      time: product.createdAt,
    })),
    ...recentVendors.map((vendor) => ({
      type: "Vendor",
      action: `Vendor ${vendor.storeName} updated`,
      details: `Status: ${vendor.status}`,
      time: vendor.updatedAt,
    })),
  ];

  // Returning all necessary data
  return {
    totalUsers,
    usersChange,
    totalProducts,
    productsChange,
    totalOrders,
    ordersChange,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
    revenueChange,
    activeVendors,
    vendorsChange: activeVendors, // We can calculate a more accurate percentage change if needed
    pendingApprovals,
    topVendors,
    recentActivities,
    growthStats: {
      usersGrowth: usersChange,
      productsGrowth: productsChange,
      ordersGrowth: ordersChange,
      revenueGrowth: revenueChange,
    },
  };
};

const getAdminProductStats = async () => {
  // Total Products
  const totalProducts = await Product.countDocuments();

  // Active Products (e.g., in stock, not flagged)
  const activeProducts = await Product.countDocuments({
    inStock: true,
    isDraft: false,
  });

  // Pending Review Products (assuming a 'pending' status or something similar)
  const pendingReview = await Product.countDocuments({ status: "pending" });

  // Flagged Products (assuming a 'flagged' field or similar)
  const flaggedProducts = await Product.countDocuments({ flagged: true });

  // Canceled Products (assuming canceled products are flagged or have a canceled status)
  const canceledProducts = await Product.countDocuments({ status: "canceled" });

  return {
    totalProducts,
    activeProducts,
    pendingReview,
    flaggedProducts,
    canceledProducts,
  };
};

// Get all products with sales, price, stock, and vendor info
const getAllProductsAdmin = async ({
  query,
  minPrice,
  maxPrice,
  condition,
  sortBy,
  page,
  limit,
}) => {
  const searchQuery = {};

  // Handle multiple query filters (name, tags, category, etc.)
  if (query) {
    const queryRegEx = { $regex: query, $options: "i" }; // Case-insensitive regex search
    searchQuery.$or = [
      { productName: queryRegEx }, // Check productName
      { category: queryRegEx }, // Check category
      { tags: { $in: query.split(",") } }, // Check tags
    ];
  }

  // Price range filter
  if (minPrice) searchQuery.price = { ...searchQuery.price, $gte: minPrice };
  if (maxPrice) searchQuery.price = { ...searchQuery.price, $lte: maxPrice };

  // Condition filter
  if (condition) searchQuery.condition = condition;

  // Pagination logic
  const skip = (page - 1) * limit;

  // Determine sort option
  let sort = {};
  switch (sortBy) {
    case "lowToHigh":
      sort.price = 1;
      break;
    case "highToLow":
      sort.price = -1;
      break;
    case "A-Z":
      sort.productName = 1;
      break;
    case "a-z":
      sort.productName = -1;
      break;
    case "newestFirst":
    default:
      sort.createdAt = -1;
  }

  // Query the database with the built query object
  const products = await Product.find(searchQuery)
    .populate("vendor", "storeName") // Populate the vendor's store name
    .select("productName category price stockQuantity condition vendor") // Select specific fields
    .skip(skip) // Pagination: skip to the appropriate page
    .limit(Number(limit)) // Limit the number of results
    .sort(sort) // Sorting based on user input
    .lean(); // Return plain JavaScript objects

  // Get product sales from orders
  for (let product of products) {
    const sales = await Order.aggregate([
      { $match: { "totalItems.productId": product._id, status: "delivered" } },
      {
        $group: {
          _id: "$totalItems.productId",
          totalSales: { $sum: "$totalItems.price" },
        },
      },
    ]);
    product.sales = sales.length > 0 ? sales[0].totalSales : 0;
  }

  // If no products are found, throw an error
  if (products.length === 0) {
    return [];
  }

  return products;
};

const getAdminOrderStats = async () => {
  // Total Orders
  const totalOrders = await Order.countDocuments();

  // Orders in Pending or Processing status
  const pendingOrders = await Order.countDocuments({
    status: { $in: ["pending", "processing"] },
  });

  // Completed Orders
  const completedOrders = await Order.countDocuments({ status: "completed" });

  // Total Sales (from completed orders)
  const totalSales = await Order.aggregate([
    { $match: { status: "completed" } },
    { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
  ]);

  return {
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSales: totalSales[0]?.totalSales || 0,
  };
};

// Fetch all orders with detailed information
const getAllOrders = async ({ query, page, limit }) => {
  const skip = (page - 1) * limit;

  // Constructing the filter query
  const searchQuery = {};

  // If a 'query' parameter is passed, filter by order ID or customer name
  if (query) {
    const queryRegEx = { $regex: query, $options: "i" }; // Case-insensitive regex search
    searchQuery.$or = [
      { orderID: queryRegEx }, // Check orderID
      { "customer.name": queryRegEx }, // Check customer name
    ];
  }

  // Query the database with filters and pagination
  const orders = await Order.find(searchQuery)
    .populate("customer", "name email image") // Populate customer details
    .select("orderID customer totalAmount status totalItems createdAt vendorId") // Select relevant fields
    .skip(skip) // Pagination
    .limit(Number(limit)) // Limit the number of results
    .sort({ createdAt: -1 }) // Sort by order creation time (latest first)
    .lean(); // Use lean to return plain JavaScript objects

  // If no orders are found, throw an error
  if (orders.length === 0) {
    return [];
  }

  // Add additional details to each order (like how many items)
  for (let order of orders) {
    order.itemsCount = order.totalItems.length; // Count how many items in the order
  }

  return orders;
};

// get all the payment request
const getAdminAllPaymentRequests = async ({
  search,
  status,
  sortBy = "newestFirst",
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;
  const query = {};

  // Search functionality for vendor name and bank name
  if (search) {
    // Search by vendor name
    const vendorSearch = await User.find({
      storeName: { $regex: search, $options: "i" },
      type: "seller",
    });

    const vendorIds = vendorSearch.map((vendor) => vendor._id);

    // If vendor search is found, filter by vendor ID
    if (vendorIds.length > 0) {
      query.seller = { $in: vendorIds }; // Filter by vendors found in search
    }

    // Search by bank name
    query.$or = [
      { bankName: { $regex: search, $options: "i" } }, // Case-insensitive search for bankName
    ];
  }

  // Filter by payment request status
  if (status) {
    query.status = status;
  }

  // Sorting logic
  let sortOption = {};
  switch (sortBy) {
    case "newestFirst":
      sortOption = { requestDate: -1 };
      break;
    case "oldestFirst":
      sortOption = { requestDate: 1 };
      break;
    case "highToLow":
      sortOption = { withdrawalAmount: -1 };
      break;
    case "lowToHigh":
      sortOption = { withdrawalAmount: 1 };
      break;
    default:
      sortOption = { requestDate: -1 };
  }

  // Fetching payment requests based on the filters and sorting
  const paymentRequests = await PaymentRequest.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  // Decrypt bankName and accountNumber for each payment request
  const decryptedPaymentRequests = paymentRequests.map((request) => {
    const decryptedDetails = request.decryptBankDetails(); // Decrypt bank details
    return {
      ...request.toObject(), // Convert mongoose document to plain object
      bankName: decryptedDetails.bankName, // Add decrypted bankName
      accountNumber: decryptedDetails.accountNumber, // Add decrypted accountNumber
    };
  });

  // Get total number of records matching the query (for total pages calculation)
  const totalRecords = await PaymentRequest.countDocuments(query);

  // Calculate total pages based on total records and limit
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    paymentRequests: decryptedPaymentRequests,
    currentPage: page,
    totalPages: totalPages,
    totalRecords: totalRecords,
  };
};

// getadminpaymentrequestStats

const getAdminPaymentRequestStats = async () => {
  const stats = await PaymentRequest.aggregate([
    {
      $group: {
        _id: null,
        totalRequests: { $sum: 1 }, // Count of all requests
        pendingRequests: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
        }, // Count of pending requests
        approvedRequests: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] },
        }, // Count of approved requests
        totalAmount: { $sum: "$withdrawalAmount" }, // Sum of all withdrawal amounts
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : {
        totalRequests: 0,
        pendingRequests: 0,
        approvedRequests: 0,
        totalAmount: 0,
      };
};

module.exports = {
  getAllUsers,
  getAllVendors,
  updateVendor,
  getAdminDashboardData,
  getAllProductsAdmin,
  getAdminProductStats,
  getAdminOrderStats,
  getAllOrders,
  getAdminAllPaymentRequests,
  getAdminPaymentRequestStats,
};
