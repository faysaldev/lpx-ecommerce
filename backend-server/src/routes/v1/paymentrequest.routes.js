const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentRequestController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-pay-request")
  .get(auth("common"), paymentRequestController.getpaymentRequest);

router
  .route("/create-pay-request")
  .post(auth("common"), paymentRequestController.createNewPaymentRequest);

router
  .route("/update-pay-request-status/:id")
  .patch(auth("common"), paymentRequestController.updatePaymentRequest);

module.exports = router;
