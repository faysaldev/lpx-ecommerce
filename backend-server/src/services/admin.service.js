const httpStatus = require("http-status");
const {
  User,
  Vendor,
  Product,
  Order,
  Category,
  PaymentRequest,
  Rating,
} = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");

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

// getPayment Vendor summeries
const getAdminVendorSummary = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  // Get vendors with pagination
  const vendors = await Vendor.find().skip(skip).limit(Number(limit));

  const totalVendors = await Vendor.countDocuments(); // Total count of vendors

  const vendorSummaries = [];

  // For each vendor, calculate the required metrics
  for (const vendor of vendors) {
    const vendorId = vendor._id;

    // Total earnings and total withdrawal amount
    const totalEarnings = vendor.totalEarnings;
    const totalWithdrawal = vendor.totalWithDrawal;

    // Get total paid and pending amounts from PaymentRequests
    const paidPayments = await PaymentRequest.aggregate([
      { $match: { seller: vendorId, status: "paid" } },
      { $group: { _id: null, totalPaid: { $sum: "$withdrawalAmount" } } },
    ]);
    const pendingPayments = await PaymentRequest.aggregate([
      { $match: { seller: vendorId, status: "pending" } },
      { $group: { _id: null, totalPending: { $sum: "$withdrawalAmount" } } },
    ]);

    const totalPaidAmount = paidPayments.length ? paidPayments[0].totalPaid : 0;
    const totalPendingAmount = pendingPayments.length
      ? pendingPayments[0].totalPending
      : 0;

    // Get total orders for the vendor
    const totalOrders = await Order.countDocuments({
      "totalItems.vendorId": vendorId,
      status: { $ne: "unpaid" }, // Exclude orders with status "unpaid"
    });

    // Calculate the average order value
    const totalOrderValue = await Order.aggregate([
      { $match: { "totalItems.vendorId": vendorId } },
      { $group: { _id: null, totalOrderValue: { $sum: "$totalAmount" } } },
    ]);
    const avgOrderValue = totalOrders
      ? totalOrderValue[0]?.totalOrderValue / totalOrders
      : 0;

    // Get the last payment date
    const lastPayment = await PaymentRequest.findOne({ seller: vendorId })
      .sort({ requestDate: -1 })
      .limit(1);

    vendorSummaries.push({
      vendorId,
      storeName: vendor.storeName,
      totalEarnings,
      totalWithdrawal,
      totalPaidAmount,
      totalPendingAmount,
      totalOrders,
      avgOrderValue,
      lastPayment: lastPayment ? lastPayment.requestDate : null,
    });
  }

  const totalPages = Math.ceil(totalVendors / limit);

  return {
    vendorSummaries,
    currentPage: page,
    totalPages,
    totalVendors,
  };
};

// payment Distrubution details
const getAdminFinancialOverview = async () => {
  // Define the last 20 days
  const last20Days = new Date();
  last20Days.setDate(last20Days.getDate() - 20);

  // Payment Status Distribution (Count by status in last 20 days)
  const paymentStatusDistribution = await PaymentRequest.aggregate([
    { $match: { requestDate: { $gte: last20Days } } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Financial Overview (Pie chart format)
  const financialOverview = await PaymentRequest.aggregate([
    { $match: { requestDate: { $gte: last20Days } } },
    {
      $group: {
        _id: null,
        totalPaid: {
          $sum: {
            $cond: [{ $eq: ["$status", "paid"] }, "$withdrawalAmount", 0],
          },
        },
        totalPending: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, "$withdrawalAmount", 0],
          },
        },
        totalRejected: {
          $sum: {
            $cond: [{ $eq: ["$status", "rejected"] }, "$withdrawalAmount", 0],
          },
        },
      },
    },
  ]);

  // Prepare pie chart data
  const pieChartData = {
    paid: financialOverview[0]?.totalPaid || 0,
    pending: financialOverview[0]?.totalPending || 0,
    rejected: financialOverview[0]?.totalRejected || 0,
  };

  // Recent Payment Activity (Recent 20 days data)
  const recentPaymentActivity = await PaymentRequest.find({
    requestDate: { $gte: last20Days },
  })
    .sort({ requestDate: -1 })
    .limit(5); // Get the last 5 payment activities

  // Decrypt bank information for each recent payment activity
  const decryptedRecentPaymentActivity = recentPaymentActivity.map(
    (request) => {
      const decryptedDetails = request.decryptBankDetails(); // Decrypt bank details
      return {
        ...request.toObject(), // Convert mongoose document to plain object
        bankName: decryptedDetails.bankName, // Add decrypted bankName
        accountNumber: decryptedDetails.accountNumber, // Add decrypted accountNumber
      };
    }
  );

  return {
    paymentStatusDistribution, // Distribution of payment statuses
    financialOverview: pieChartData, // Pie chart data
    recentPaymentActivity: decryptedRecentPaymentActivity, // Decrypted recent payment activities
  };
};

// TODO: approve payment request with invoices
// const approvedAdminPayment = async ({ paymentId, data }) => {
//   try {
//     const { note, invoiceImage, status } = data;

//     // Ensure that the status is either "paid" or "rejected"
//     if (status !== "paid" && status !== "rejected") {
//       return "Invalid status provided";
//     }

//     // Prepare the update data object
//     const updateData = {};

//     // If the status is "paid", we expect an invoiceImage to be present, as it's required for paid status
//     if (status === "paid" && !invoiceImage) {
//       return "Invoice image is required when the status is 'paid'";
//     }

//     // Update the relevant fields
//     updateData.status = status; // Set the status to "paid" or "rejected"
//     updateData.paidDate = status === "paid" ? new Date() : null; // Set the paidDate only if status is "paid"

//     if (note) {
//       updateData.note = note; // Note is optional for both statuses
//     }

//     if (status === "paid" && invoiceImage) {
//       updateData.invoiceImage = invoiceImage; // Invoice image is optional but required when status is "paid"
//     }

//     // Find the payment request by paymentId and update the fields
//     const updatedPaymentRequest = await PaymentRequest.findOneAndUpdate(
//       { _id: paymentId }, // Find the payment request by paymentId
//       { $set: updateData }, // Update only the fields that are provided
//       { new: true } // Return the updated document
//     );

//     if (!updatedPaymentRequest) {
//       return "Payment request not found";
//     }

//     return updatedPaymentRequest;
//   } catch (error) {
//     console.error("Error updating payment request:", error);
//     return "Error updating payment request";
//   }
// };

const approvedAdminPayment = async ({ paymentId, data }) => {
  try {
    const { note, invoiceImage, status } = data;

    // Ensure that the status is either "paid" or "rejected"
    if (status !== "paid" && status !== "rejected") {
      return "Invalid status provided";
    }

    // Prepare the update data object
    const updateData = {};

    // If the status is "paid", we expect an invoiceImage to be present, as it's required for paid status
    if (status === "paid" && !invoiceImage) {
      return "Invoice image is required when the status is 'paid'";
    }

    // Update the relevant fields
    updateData.status = status; // Set the status to "paid" or "rejected"
    updateData.paidDate = status === "paid" ? new Date() : null; // Set the paidDate only if status is "paid"

    if (note) {
      updateData.note = note; // Note is optional for both statuses
    }

    if (status === "paid" && invoiceImage) {
      updateData.invoiceImage = invoiceImage; // Invoice image is optional but required when status is "paid"
    }

    // Find the payment request by paymentId and update the fields
    const updatedPaymentRequest = await PaymentRequest.findOneAndUpdate(
      { _id: paymentId }, // Find the payment request by paymentId
      { $set: updateData }, // Update only the fields that are provided
      { new: true } // Return the updated document
    );

    if (!updatedPaymentRequest) {
      return "Payment request not found";
    }

    return updatedPaymentRequest;
  } catch (error) {
    console.error("Error updating payment request:", error);
    return "Error updating payment request";
  }
};

// admin analytics file code

const calculateChange = (current, previous) => {
  if (!previous || previous === 0) return { count: current, percentage: 0 };
  const change = ((current - previous) / previous) * 100;
  return { count: current, percentage: change };
};

const getAdminAnalyticsDashboardStats = async () => {
  const lastMonth = new Date();
  const currentMonthStart = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth(),
    1
  );
  const lastMonthStart = new Date(
    lastMonth.getFullYear(),
    lastMonth.getMonth() - 1,
    1
  );
  const lastMonthEnd = new Date(currentMonthStart);
  lastMonthEnd.setDate(lastMonthStart.getDate() + 31); // Assuming a max of 31 days in a month

  // Helper function to get total revenue for a time period
  const getTotalRevenue = async (startDate, endDate) => {
    const result = await Order.aggregate([
      {
        $match: {
          status: "delivered",
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    return result[0]?.totalRevenue || 0;
  };

  // Get total revenue for current and previous month
  const totalRevenueCurrentMonth = await getTotalRevenue(
    currentMonthStart,
    lastMonthEnd
  );
  const totalRevenuePreviousMonth = await getTotalRevenue(
    lastMonthStart,
    currentMonthStart
  );

  // Calculate revenue change
  const revenueChange = calculateChange(
    totalRevenueCurrentMonth,
    totalRevenuePreviousMonth
  );

  // Get total sales (orders) for current and previous month
  const totalSalesCurrentMonth = await Order.countDocuments({
    status: "delivered",
    createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
  });

  const totalSalesPreviousMonth = await Order.countDocuments({
    status: "delivered",
    createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
  });

  // Calculate sales change
  const salesChange = calculateChange(
    totalSalesCurrentMonth,
    totalSalesPreviousMonth
  );

  // Get total active users in the current and previous month
  const getActiveUsersCount = async (startDate, endDate) => {
    const users = await Order.distinct("customer", {
      createdAt: { $gte: startDate, $lt: endDate },
      status: "delivered",
    });
    return await User.countDocuments({ _id: { $in: users } });
  };

  const activeUsersCurrentMonth = await getActiveUsersCount(
    currentMonthStart,
    lastMonthEnd
  );
  const activeUsersPreviousMonth = await getActiveUsersCount(
    lastMonthStart,
    currentMonthStart
  );

  // Calculate active users change
  const activeUsersChange = calculateChange(
    activeUsersCurrentMonth,
    activeUsersPreviousMonth
  );

  // Get total products listed in the current and previous month
  const totalProductsListedCurrentMonth = await Product.countDocuments({
    createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
  });

  const totalProductsListedPreviousMonth = await Product.countDocuments({
    createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
  });

  // Calculate products listed change
  const productsListedChange = calculateChange(
    totalProductsListedCurrentMonth,
    totalProductsListedPreviousMonth
  );

  return {
    totalRevenue: {
      count: totalRevenueCurrentMonth,
      percentage: revenueChange.percentage,
    },
    totalSales: {
      count: totalSalesCurrentMonth,
      percentage: salesChange.percentage,
    },
    activeUsers: {
      count: activeUsersCurrentMonth,
      percentage: activeUsersChange.percentage,
    },
    totalProductsListed: {
      count: totalProductsListedCurrentMonth,
      percentage: productsListedChange.percentage,
    },
  };
};

const getAdminTopCategoriesBySales = async () => {
  // Aggregating the sales by category based on orders
  const topCategories = await Order.aggregate([
    { $unwind: "$totalItems" }, // Flatten the totalItems array
    {
      $lookup: {
        from: "products",
        localField: "totalItems.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" }, // Unwind the product data
    {
      $group: {
        _id: "$product.category", // Group by category
        totalSales: { $sum: 1 }, // Count the total sales per category
      },
    },
    { $sort: { totalSales: -1 } }, // Sort by the highest sales count
    {
      $project: {
        category: "$_id", // Rename the field to 'category'
        totalSales: 1,
        _id: 0, // Exclude the internal _id field
      },
    },
  ]);

  return topCategories;
};

const getAdminRecentAnalyticsTrends = async () => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30); // Last 30 days for trends

  // Most Active User Trends (Users with most orders)
  const activeUsers = await Order.aggregate([
    { $match: { createdAt: { $gte: last30Days } } },
    {
      $group: {
        _id: "$customer", // Group by customer
        totalOrders: { $sum: 1 },
      },
    },
    { $sort: { totalOrders: -1 } },
    { $limit: 5 }, // Top 5 active users
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" }, // Unwind to get user details
    {
      $project: {
        userId: "$_id",
        userName: "$user.name",
        totalOrders: 1,
        _id: 0,
      },
    },
  ]);

  // Cart Percentage
  const cartCount = await Cart.countDocuments({
    createdAt: { $gte: last30Days },
  });
  const purchaseCount = await Order.countDocuments({
    createdAt: { $gte: last30Days },
    status: "delivered",
  });
  const cartPercentage = (cartCount / purchaseCount) * 100;

  // Average Order Value (AOV)
  const totalOrderValue = await Order.aggregate([
    { $match: { createdAt: { $gte: last30Days }, status: "delivered" } },
    {
      $group: {
        _id: null,
        totalValue: { $sum: "$totalAmount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const averageOrderValue =
    totalOrderValue[0]?.totalValue / totalOrderValue[0]?.totalOrders;

  // Customer Satisfaction (Average Rating for Vendor)
  const vendorRatings = await Rating.aggregate([
    { $match: { ratingType: "vendor", createdAt: { $gte: last30Days } } },
    {
      $group: {
        _id: "$referenceId", // Group by vendor
        averageRating: { $avg: "$rating" },
      },
    },
    { $sort: { averageRating: -1 } },
    { $limit: 5 }, // Top 5 vendors based on customer satisfaction
    {
      $lookup: {
        from: "vendors",
        localField: "_id",
        foreignField: "_id",
        as: "vendor",
      },
    },
    { $unwind: "$vendor" }, // Unwind to get vendor details
    {
      $project: {
        vendorId: "$_id",
        vendorName: "$vendor.storeName",
        averageRating: 1,
        _id: 0,
      },
    },
  ]);

  return {
    activeUsers,
    cartPercentage,
    averageOrderValue,
    vendorRatings,
  };
};

// TODO: total revinue trends
const getAnalyticsTotalReviewTrends = async () => {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  // Aggregating reviews by day and status (based on rating type)
  const reviewTrends = await Rating.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          status: "$ratingType",
        },
        totalReviews: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      $project: {
        day: "$_id.day",
        status: "$_id.status",
        totalReviews: 1,
        _id: 0,
      },
    },
  ]);

  // Format data to fit the Recharts format
  const formattedData = reviewTrends.map((trend) => ({
    date: `${trend.year}-${trend.month}-${trend.day}`,
    status: trend.status,
    totalReviews: trend.totalReviews,
  }));

  return formattedData;
};

const getAnalyticsTotalSalesTrends = async () => {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  // Aggregating sales by day and status
  const salesTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          status: "$status",
        },
        totalSales: { $sum: "$totalAmount" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      $project: {
        day: "$_id.day",
        status: "$_id.status",
        totalSales: 1,
        _id: 0,
      },
    },
  ]);

  // Format data to fit the Recharts format
  const formattedData = salesTrends.map((trend) => ({
    date: `${trend.year}-${trend.month}-${trend.day}`,
    status: trend.status,
    totalSales: trend.totalSales,
  }));

  return formattedData;
};

const getAnalyticsTotalUsersTrends = async () => {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  // Aggregating user trends by day based on orders
  const userTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      },
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
        },
        uniqueUsers: { $addToSet: "$customer" }, // Get unique users
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      $project: {
        day: "$_id.day",
        uniqueUsers: { $size: "$uniqueUsers" }, // Count unique users
        _id: 0,
      },
    },
  ]);

  // Format data to fit the Recharts format
  const formattedData = userTrends.map((trend) => ({
    date: `${trend.year}-${trend.month}-${trend.day}`,
    totalUsers: trend.uniqueUsers,
  }));

  return formattedData;
};

const getAnalyticsProductsTrends = async () => {
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  // Aggregating product trends by day (count of products sold)
  const productSalesTrends = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
        status: "delivered", // Only consider completed sales
      },
    },
    {
      $unwind: "$totalItems",
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" },
          productId: "$totalItems.productId",
        },
        totalSales: { $sum: "$totalItems.quantity" },
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
    },
    {
      $project: {
        day: "$_id.day",
        productId: "$_id.productId",
        totalSales: 1,
        _id: 0,
      },
    },
  ]);

  // Format data to fit the Recharts format
  const formattedData = productSalesTrends.map((trend) => ({
    date: `${trend.year}-${trend.month}-${trend.day}`,
    productId: trend.productId,
    totalSales: trend.totalSales,
  }));

  return formattedData;
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
  getAdminVendorSummary,
  getAdminFinancialOverview,
  approvedAdminPayment,
  getAdminAnalyticsDashboardStats,
  getAdminTopCategoriesBySales,
  getAdminRecentAnalyticsTrends,
  getAnalyticsProductsTrends,
  getAnalyticsTotalUsersTrends,
  getAnalyticsTotalSalesTrends,
  getAnalyticsTotalReviewTrends,
};

// const getAdminAnalyticsDashboardStats = async () => {
//   const lastMonth = new Date();
//   const currentMonthStart = new Date(
//     lastMonth.getFullYear(),
//     lastMonth.getMonth(),
//     1
//   );
//   const lastMonthStart = new Date(
//     lastMonth.getFullYear(),
//     lastMonth.getMonth() - 1,
//     1
//   );

//   const lastMonthEnd = new Date(currentMonthStart);
//   lastMonthEnd.setDate(lastMonthStart.getDate() + 31); // Assuming a max of 31 days in a month

//   // Get total revenue in the last month
//   const totalRevenueCurrentMonth = await Order.aggregate([
//     {
//       $match: {
//         status: "delivered",
//         createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
//       },
//     },
//     { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
//   ]);

//   // Get total revenue from the previous month
//   const totalRevenuePreviousMonth = await Order.aggregate([
//     {
//       $match: {
//         status: "delivered",
//         createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
//       },
//     },
//     { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
//   ]);

//   // Calculate percentage change for total revenue
//   const revenueChange = totalRevenueCurrentMonth[0]?.totalRevenue
//     ? ((totalRevenueCurrentMonth[0].totalRevenue -
//         (totalRevenuePreviousMonth[0]?.totalRevenue || 0)) /
//         (totalRevenuePreviousMonth[0]?.totalRevenue || 1)) *
//       100
//     : 0;

//   // Get total sales (number of orders) for current and previous month
//   const totalSalesCurrentMonth = await Order.countDocuments({
//     status: "delivered",
//     createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
//   });

//   const totalSalesPreviousMonth = await Order.countDocuments({
//     status: "delivered",
//     createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
//   });

//   // Calculate percentage change for sales
//   const salesChange = totalSalesCurrentMonth
//     ? ((totalSalesCurrentMonth - totalSalesPreviousMonth) /
//         totalSalesPreviousMonth) *
//       100
//     : 0;

//   // Get total active users in the current month (users who made orders)
//   const activeUsersCurrentMonth = await User.countDocuments({
//     _id: {
//       $in: await Order.distinct("customer", {
//         createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
//         status: "delivered",
//       }),
//     },
//   });

//   const activeUsersPreviousMonth = await User.countDocuments({
//     _id: {
//       $in: await Order.distinct("customer", {
//         createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
//         status: "delivered",
//       }),
//     },
//   });

//   // Calculate percentage change for active users
//   const activeUsersChange = activeUsersCurrentMonth
//     ? ((activeUsersCurrentMonth - activeUsersPreviousMonth) /
//         activeUsersPreviousMonth) *
//       100
//     : 0;

//   // Get total products listed in the last month
//   const totalProductsListedCurrentMonth = await Product.countDocuments({
//     createdAt: { $gte: currentMonthStart, $lt: lastMonthEnd },
//   });

//   const totalProductsListedPreviousMonth = await Product.countDocuments({
//     createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
//   });

//   // Calculate percentage change for products listed
//   const productsListedChange = totalProductsListedCurrentMonth
//     ? ((totalProductsListedCurrentMonth - totalProductsListedPreviousMonth) /
//         totalProductsListedPreviousMonth) *
//       100
//     : 0;

//   return {
//     totalRevenueCurrentMonth: totalRevenueCurrentMonth[0]?.totalRevenue || 0,
//     revenueChange,
//     totalSalesCurrentMonth,
//     salesChange,
//     activeUsersCurrentMonth,
//     activeUsersChange,
//     totalProductsListedCurrentMonth,
//     productsListedChange,
//   };
// };
