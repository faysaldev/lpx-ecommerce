const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Notification = require("../models/notification.model");

const getMyNotification = async (userId, notificationType = null) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // If notificationType is provided, filter by type
  const query = { authorId: userId };
  if (notificationType && notificationType != "all") {
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

const removeAllNotification = async (authorId, type) => {
  if (!type) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Notification.deleteMany({ authorId, type });
};

const makeAllNotificationRead = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  try {
    const result = await Notification.updateMany(
      { authorId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    if (result.nModified === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, "No unread notifications found");
    }

    return { message: "All notifications marked as read" };
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  getMyNotification,
  addNewNotification,
  updateNotification,
  makeAllNotificationRead,
  removeNotification,
  removeAllNotification,
};
