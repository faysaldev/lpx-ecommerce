const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { notificationService } = require("../services");

const getMyNotification = catchAsync(async (req, res) => {
  const { type } = req.query; // Get the type from query parameters (optional)

  // Call the service with the user ID and optional notification type
  const notifications = await notificationService.getMyNotification(
    req.user.id,
    type
  );

  res.status(httpStatus.CREATED).json(
    response({
      message: "All the notifications",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notifications,
    })
  );
});

const addNewNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.addNewNotification({
    authorId: req.user.id,
    ...req.body,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Added notification",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notification,
    })
  );
});

const updateNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.updateNotification(
    req.params.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Updated notification",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notification,
    })
  );
});

const makeAllNotificationRead = catchAsync(async (req, res) => {
  const notification = await notificationService.makeAllNotificationRead(
    req.user.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Updated notification",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notification,
    })
  );
});

const removeNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.removeNotification(
    req.params.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Deleted notification",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notification,
    })
  );
});

const removeAllNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.removeAllNotification(
    req.user.id,
    req.query.type
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Deleted notification",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: notification,
    })
  );
});

module.exports = {
  getMyNotification,
  addNewNotification,
  updateNotification,
  removeNotification,
  makeAllNotificationRead,
  removeAllNotification,
};
