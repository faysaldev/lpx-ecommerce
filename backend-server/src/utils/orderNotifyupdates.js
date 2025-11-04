const {
  orderService,
  userService,
  notificationService,
  emailService,
} = require("../services");

const orderWebhookUpdates = async (orderId, orderStatus) => {
  const orders = await orderService.getOrderSingleStatusUpdate(
    orderId,
    orderStatus
  );
  if (!orders) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to update Make it ${orderStatus} `
    );
  }
  const user = await userService.getUserById(orders.customer);
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
