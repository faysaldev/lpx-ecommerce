const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { vendorService } = require("../services");

const getVendors = catchAsync(async (req, res) => {
  const vendors = await vendorService.getVendors(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

module.exports = {
  getVendors,
};
