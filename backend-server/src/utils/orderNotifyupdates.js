// const {
//   emailService,
//   notificationService,
//   orderService,
//   userService,
// } = require("../services");

const {
  orderService,
  userService,
  notificationService,
  emailService,
} = require("../services");

const orderWebhookUpdates = async (orderId, orderStatus) => {
  console.log(orderId, orderStatus, "order ides");

  const orders = await orderService.getOrderSingleStatusUpdate(
    orderId,
    orderStatus
  );

  console.log(orders, "order data over here");

  if (!orders) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to update Make it ${orderStatus} `
    );
  }
  const user = await userService.getUserById(orders.customer);
  console.log(user, "user data over here");

  const orderUpdatesNotification = {
    authorId: user?.id,
    sendTo: user?.id,
    transactionId: user.id,
    title: `Your Order  has been ${orderStatus}`,
    description:
      `Your Order ${orders.orderID} Have  Been ${orderStatus} ` ||
      "No additional notes provided.",
    type: "orders",
  };

  await notificationService.addNewNotification(orderUpdatesNotification);
  const orderUpdateEmail = {
    username: user?.name,
    title: `Your Order has been ${orderStatus}`,
    status: orderStatus,
    orderId: orders.orderID,
  };
  // removed the await section
  emailService.sendNotificationEmailWithDelayOrderUpdates(
    user?.email || "admin@gmail.com",
    orderUpdateEmail,
    5000
  );
};

module.exports = { orderWebhookUpdates };
