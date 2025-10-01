const httpStatus = require("http-status");
const { User, Vendor, Product, Order, Category } = require("../models");
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
      .limit(limit);
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

module.exports = {
  getAllUsers,
  getAllVendors,
  updateVendor,
  getAdminDashboardData,
};
