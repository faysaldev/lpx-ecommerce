const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Notification = require("../models/notification.model");

const getMyNotification = async (userId, notificationType = null) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // If notificationType is provided, filter by type
  const query = { userId: userId };
  if (notificationType) {
    query.type = notificationType;
  }

  return Notification.find(query); // Find notifications based on the query
};

const addNewNotification = async (notificationBody) => {
  if (!notificationBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Notification.create(notificationBody);
};

const updateNotification = async (notificationId) => {
  if (!notificationId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};
const removeNotification = async (notificationId) => {
  if (!notificationId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Notification.findByIdAndDelete(notificationId);
};

module.exports = {
  getMyNotification,
  addNewNotification,
  updateNotification,
  removeNotification,
};
