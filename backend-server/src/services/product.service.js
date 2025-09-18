const httpStatus = require("http-status");
const { Product } = require("../models");
const ApiError = require("../utils/ApiError");

const getMyProducts = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.find({ seller: userId });
};

module.exports = {
  getMyProducts,
};
