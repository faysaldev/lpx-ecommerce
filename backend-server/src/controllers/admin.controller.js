const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { adminService } = require("../services");

const getAllUsers = catchAsync(async (req, res) => {
  const alluser = await adminService.getAllUsers(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the user list",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: alluser,
    })
  );
});

const getAllVendors = catchAsync(async (req, res) => {
  console.log(req.user.type);

  if (req.user.type === "customer" || req.user.type == "seller") {
    res.status(httpStatus.CREATED).json(
      response({
        message: "You are not a admin. this route is protected for admin only",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: "",
      })
    );
  }
  let allVendors;
  if (req.query) {
    allVendors = await adminService.getAllVendors(req.query);
  } else {
    allVendors = await adminService.getAllVendors();
  }
  res.status(httpStatus.CREATED).json(
    response({
      message: "Get all the vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: allVendors,
    })
  );
});

const updateStatus = catchAsync(async (req, res) => {
  if (req.user.type === "customer" || req.user.type == "seller") {
    res.status(httpStatus.CREATED).json(
      response({
        message: "You are not a admin. this route is protected for admin only",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: "",
      })
    );
  }

  const updatedVendor = adminService.updateVendor(req.body);

  res.status(httpStatus.CREATED).json(
    response({
      message: " vendors updated",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: updatedVendor,
    })
  );
});

const getAdminDashboard = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  if (req.user.type !== "admin") return;
  const dashboardData = await adminService.getAdminDashboardData();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardData,
    })
  );
});

const getAdminProductStats = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  if (req.user.type !== "admin") return;
  const dashboardProductStats = await adminService.getAdminProductStats();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardProductStats,
    })
  );
});

const getAllProductsAdmin = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  if (req.user.type !== "admin") return;
  const {
    query,
    minPrice,
    maxPrice,
    condition,
    sortBy = "newestFirst", // Default sort: newestFirst
    page = 1, // Default page: 1
    limit = 20, // Default limit: 20
  } = req.query;
  const addProductsFromAdmin = await adminService.getAllProductsAdmin({
    query,
    minPrice,
    maxPrice,
    condition,
    sortBy,
    page,
    limit,
  });

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: addProductsFromAdmin,
    })
  );
});

const getAdminOrderStats = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  if (req.user.type !== "admin") return;
  const dashboardOrdersStats = await adminService.getAdminOrderStats();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardOrdersStats,
    })
  );
});

const getAllOrders = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  if (req.user.type !== "admin") return;
  const {
    query,
    page = 1, // Default page: 1
    limit = 20, // Default limit: 20
  } = req.query;
  const dashboardOrdersStats = await adminService.getAllOrders({
    query,
    page,
    limit,
  });

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardOrdersStats,
    })
  );
});

// get all the payment request with filterization

const getAdminAllPaymentRequests = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;
  const { search, status, sortBy, page, limit } = req.query;
  const dashboardOrdersStats = await adminService.getAdminAllPaymentRequests({
    search,
    status,
    sortBy,
    page: Number(page) || 1,
    limit: Number(limit) || 10,
  });

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardOrdersStats,
    })
  );
});

const getAdminPaymentRequestStats = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;
  const dashboardPaymentRequestStats =
    await adminService.getAdminPaymentRequestStats();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: dashboardPaymentRequestStats,
    })
  );
});

const getAdminVendorSummary = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;
  const { limit, page } = req.query;
  const adminPayVendorSumemries = await adminService.getAdminVendorSummary({
    page,
    limit,
  });

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "Admin Dashboard data fetched successfully",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: adminPayVendorSumemries,
    })
  );
});

const getAdminFinancialOverview = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;
  const adminPayVendorSumemries =
    await adminService.getAdminFinancialOverview();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "FinalCial Statitics",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: adminPayVendorSumemries,
    })
  );
});

// TODO: admin approving money
const approvedAdminPayment = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;
  if (req.file) {
    req.body.invoiceImage = `/uploads/invoices/${req.file.filename}`;
  }
  const adminApprovedPayment = await adminService.approvedAdminPayment({
    paymentId: req.params.id,
    data: req.body,
  });

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "FinalCial Statitics",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: adminApprovedPayment,
    })
  );
});

// TODO: admin analytics seciton
const getAdminAnalyticsDashboardStats = catchAsync(async (req, res) => {
  // Fetch data for the admin dashboard
  // if (req.user.type !== "admin") return;

  const adminApprovedPayment =
    await adminService.getAdminAnalyticsDashboardStats();

  // Return the data

  res.status(httpStatus.OK).json(
    response({
      message: "FinalCial Statitics",
      status: "OK",
      statusCode: httpStatus.Ok,
      data: adminApprovedPayment,
    })
  );
});

module.exports = {
  getAllUsers,
  getAllVendors,
  updateStatus,
  getAdminDashboard,
  getAdminProductStats,
  getAllProductsAdmin,
  getAdminOrderStats,
  getAllOrders,
  getAdminAllPaymentRequests,
  getAdminPaymentRequestStats,
  getAdminVendorSummary,
  getAdminFinancialOverview,
  approvedAdminPayment,
  getAdminAnalyticsDashboardStats,
};
