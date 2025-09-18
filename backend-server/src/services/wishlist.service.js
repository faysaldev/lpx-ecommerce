const httpStatus = require("http-status");
const { Wishlist } = require("../models");
const ApiError = require("../utils/ApiError");

const myWishList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.find({ customer: userId });
};

module.exports = {
  myWishList,
};
