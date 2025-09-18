const httpStatus = require("http-status");
const { Cart } = require("../models");
const ApiError = require("../utils/ApiError");

const getCarts = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.find({ customer: userId });
};

module.exports = {
  getCarts,
};
