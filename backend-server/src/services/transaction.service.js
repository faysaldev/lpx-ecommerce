const httpStatus = require("http-status");
const { Transactionction } = require("../models");
const ApiError = require("../utils/ApiError");

const myTransaction = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Transaction.find({ customer: userId });
};

module.exports = {
  myTransaction,
};
