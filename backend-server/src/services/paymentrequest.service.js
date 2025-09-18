const httpStatus = require("http-status");
const { Vendor } = require("../models");
const ApiError = require("../utils/ApiError");

const getpaymentRequest = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Vendor.find({ seller: userId });
};

module.exports = {
  getpaymentRequest,
};
