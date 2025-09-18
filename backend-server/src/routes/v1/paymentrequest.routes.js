const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentRequestController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-pay-request")
  .get(auth("common"), paymentRequestController.getpaymentRequest);

module.exports = router;
