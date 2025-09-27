const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { orderService } = require("../services");
const { sendNotificationEmail } = require("../services/email.service");

const myOrders = catchAsync(async (req, res) => {
  const ordres = await orderService.myOrders(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

const createOrder = catchAsync(async (req, res) => {
  const ordres = await orderService.createOrder({
    customer: req.user.id,
    ...req.body,
  });
  // Example usage:
  const notificationBody = {
    username: req.user.name,
    title: "Your Order #12345 Has Shipped",
    description:
      "Your recent order has been shipped and is on its way. Tracking number: TRK789456123. Expected delivery: 7-10 business days.",
    priority: "high",
    type: "orders",
    transactionId: ordres?.orderID,
    timestamp: new Date(),
  };

  // Send notification
  await sendNotificationEmail(req.user.email, notificationBody);

  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

const getOrderSingleDetails = catchAsync(async (req, res) => {
  const ordres = await orderService.getOrderSingleDetails(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
};
