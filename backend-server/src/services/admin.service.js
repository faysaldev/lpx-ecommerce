const httpStatus = require("http-status");
const { User, Vendor } = require("../models");
const ApiError = require("../utils/ApiError");

const getAllUsers = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return User.find();
};

module.exports = {
  getAllUsers,
};
