const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Wishlist = require("../models/wishlist.model");

const myWishList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.find({ customer: userId });
};

const addToWishlist = async (wishlistBody) => {
  if (!wishlistBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.create(wishlistBody);
};

const removeToWishlist = async (id) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.findByIdAndDelete(id);
};

module.exports = {
  myWishList,
  addToWishlist,
  removeToWishlist,
};
