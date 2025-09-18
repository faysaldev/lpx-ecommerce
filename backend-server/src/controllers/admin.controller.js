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

module.exports = {
  getAllUsers,
};
