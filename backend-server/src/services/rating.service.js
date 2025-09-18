const httpStatus = require("http-status");
const { Rating } = require("../models");
const ApiError = require("../utils/ApiError");

const getMyratings = async (VendorId) => {
  if (!VendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Rating.find({ vendor: VendorId });
};

module.exports = {
  getMyratings,
};
