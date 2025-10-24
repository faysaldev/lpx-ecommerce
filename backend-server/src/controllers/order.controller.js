const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const {
  orderService,
  userService,
  notificationService,
  emailService,
} = require("../services");
const { sendNotificationEmail } = require("../services/email.service");
const { addNewNotification } = require("./notification.controller");
const { Order } = require("../models");

const myOrders = catchAsync(async (req, res) => {
  const {
    status, // Filter by order status
    sortBy = "newestFirst", // Sorting option: newest first by default
    page = 1, // Default page: 1
    limit = 10, // Default limit: 10 orders per page
  } = req.query;

  // Pass parameters to the service
  const orders = await orderService.myOrders(req.user.id, {
    status,
    sortBy,
    page,
    limit,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: orders,
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
    type: "order",
    transactionId: ordres?.orderID,
    timestamp: new Date(),
  };

  // Send notification
  await sendNotificationEmail(req.user.email, notificationBody);
  // await addNewNotification({ authorId: req.user.id, ...req.body });

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

const getOrderSingleStatusUpdate = catchAsync(async (req, res) => {
  const orders = await orderService.getOrderSingleStatusUpdate(
    req.params.id,
    req.query.status
  );
  const user = await userService.getUserById(orders.customer);
  const orderUpdatesNotification = {
    authorId: user?.id,
    sendTo: user?.id,
    transactionId: user.id,
    title: `Your Order  has been ${req.query.status}`,
    description:
      `Your Order ${orders.orderID} Have  Been ${req.query.status} ` ||
      "No additional notes provided.",
    type: "orders",
  };
  await notificationService.addNewNotification(orderUpdatesNotification);
  const orderUpdateEmail = {
    username: user?.name,
    title: `Your Order has been ${req.query.status}`,
    status: req.query.status,

    orderId: orders.orderID,
  };
  await emailService.sendNotificationEmailWithDelayOrderUpdates(
    user?.email || "admin@gmail.com",
    orderUpdateEmail,
    5000
  );

  res.status(httpStatus.CREATED).json(
    response({
      message: "the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: orders,
    })
  );
});

// gotInvoice

// Function to generate PDF

// Controller to fetch order and generate PDF
const getOrderSingleDetailsInvoice = catchAsync(async (req, res) => {
  const orderId = req.params.id;

  if (!orderId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      message: "Order ID is required",
    });
  }

  // Fetch the invoice PDF buffer
  const invoice = await orderService.getOrderSingleDetailsInvoice(orderId);

  // Send the generated PDF as a download
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-LPX-${orderId}.pdf`
  );
  res.send(invoice); // Send the actual buffer as response
});

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
  getOrderSingleDetailsInvoice,
  getOrderSingleStatusUpdate,
};
