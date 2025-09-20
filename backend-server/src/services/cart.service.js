const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cart.model");

const myCartList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.find({ customer: userId });
};

const addToCartlist = async (CartListBody) => {
  if (!CartListBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.create(CartListBody);
};

const removeToCartlist = async (id) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.findByIdAndDelete(id);
};

module.exports = {
  myCartList,
  addToCartlist,
  removeToCartlist,
};
