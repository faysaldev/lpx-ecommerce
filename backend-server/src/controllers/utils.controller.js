const httpStatus = require("http-status");
const { utilsService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");

// Get Featured Products
const getFeaturedProducts = catchAsync(async (req, res) => {
  const featuredProducts = await utilsService.getFeturedProducts();
  res.status(httpStatus.OK).json({
    message: "Featured Products",
    status: "OK",
    statusCode: httpStatus.OK,
    data: featuredProducts,
  });
});

// Get LPS Statistics
const getLpsStatistics = catchAsync(async (req, res) => {
  const statistics = await utilsService.getLpsStatistics();
  res.status(httpStatus.OK).json({
    message: "LPS Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

//has purchased product
const hasUserPurchased = catchAsync(async (req, res) => {
  const statistics = await utilsService.hasUserPurchased({
    userId: req.user.id,
    entityId: req.query.id,
    type: req.query.type,
  });
  res.status(httpStatus.OK).json({
    message: "LPS Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

//has showing statitics
const headerStatistics = catchAsync(async (req, res) => {
  const statistics = await utilsService.headerStatistics(req.user.id);
  res.status(httpStatus.OK).json({
    message: "LPS Header Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

const getCustomerDashboard = catchAsync(async (req, res) => {
  const statistics = await utilsService.getCustomerDashboard(req.user.id);
  res.status(httpStatus.OK).json({
    message: "LPS customer Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

const getRecentOrders = catchAsync(async (req, res) => {
  const { page, limit } = req.query;
  const recentOrdersData = await utilsService.getVendorRecentOrders(
    req.user.id,
    page,
    limit
  );

  res.status(httpStatus.OK).json(
    response({
      message: "Vendor Recent Orders",
      status: "OK",
      statusCode: httpStatus.OK,
      data: recentOrdersData,
    })
  );
});

const vendorDashboardOverview = catchAsync(async (req, res) => {
  const recentOrdersData = await utilsService.vendorDashboardOverview(
    req.user.id
  );

  res.status(httpStatus.OK).json({
    message: "Vendor Recent Orders",
    status: "OK",
    statusCode: httpStatus.OK,
    data: recentOrdersData,
  });
});

const getVendorProducts = catchAsync(async (req, res) => {
  const { page, limit, search, status, sortBy } = req.query;
  const productsData = await utilsService.getVendorProducts(req.user.id, {
    page,
    limit,
    search,
    status,
    sortBy,
  });

  res.status(httpStatus.OK).json(
    response({
      message: "Vendor Products",
      status: "OK",
      statusCode: httpStatus.OK,
      data: productsData,
    })
  );
});

module.exports = {
  getFeaturedProducts,
  getLpsStatistics,
  hasUserPurchased,
  getCustomerDashboard,
  vendorDashboardOverview,
  getVendorProducts,
  getRecentOrders,
  headerStatistics,
};
