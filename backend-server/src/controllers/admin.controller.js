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

module.exports = {
  getAllUsers,
  getAllVendors,
  updateStatus,
  getAdminDashboard,
};
