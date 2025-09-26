const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");
const { decryptData } = require("../utils/decrypteHealper");

const myOrders = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Order.find({ customer: userId });
};

const createOrder = async (data) => {
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Order.create(data);
};

const getOrderSingleDetails = async (orderId) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await Order.findById(orderId).populate({
    path: "paymentCardId",
    select: "cardHolderName cardNumber",
  });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Decrypt the card number
  const decryptedCardNumber = decryptData(order?.paymentCardId?.cardNumber);

  return {
    ...order.toObject(),
    paymentCardId: {
      ...order.paymentCardId.toObject(),
      cardNumber: decryptedCardNumber,
    },
  };
};

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
};
