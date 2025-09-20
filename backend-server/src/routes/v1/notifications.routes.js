const express = require("express");
const auth = require("../../middlewares/auth");
const { notificationController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-notifications")
  .get(auth("common"), notificationController.getMyNotification);

router
  .route("/add")
  .post(auth("common"), notificationController.addNewNotification);

router
  .route("/make-as-read/:id")
  .patch(auth("common"), notificationController.updateNotification);

router
  .route("/remove/:id")
  .patch(auth("common"), notificationController.removeNotification);

module.exports = router;
