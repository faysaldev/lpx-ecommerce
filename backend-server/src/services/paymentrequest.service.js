const httpStatus = require("http-status");
const { PaymentRequest } = require("../models");
const ApiError = require("../utils/ApiError");

const getpaymentRequest = async (userId) => {
  return PaymentRequest.find({ seller: userId });
};

const createNewPaymentRequest = async (paymentBody) => {
  return PaymentRequest.create({ paymentBody });
};

const updatePaymentRequestStatus = async (id, paymentBody) => {
  return PaymentRequest.findByIdAndUpdate(id, { paymentBody });
};

module.exports = {
  getpaymentRequest,
  createNewPaymentRequest,
  updatePaymentRequestStatus,
};
