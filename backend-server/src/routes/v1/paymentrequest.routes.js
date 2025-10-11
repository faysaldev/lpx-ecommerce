const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentRequestController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-pay-request")
  .get(auth("common"), paymentRequestController.getpaymentRequest);

router
  .route("/create-pay")
  .post(auth("common"), paymentRequestController.createNewPayRequest);

router
  .route("/update-pay-request-status/:id")
  .patch(auth("common"), paymentRequestController.updatePaymentRequest);

router
  .route("/my-eligable-withdrawl")
  .get(auth("common"), paymentRequestController.getEligleWithDrawl);

router
  .route("/payment-request-stats")
  .get(auth("common"), paymentRequestController.getWithDrawlPaymentlStats);

router
  .route("/payment-request-summary")
  .get(auth("common"), paymentRequestController.getpaymentRequestSummery);

router
  .route("/details/:id")
  .get(auth("common"), paymentRequestController.getSinglePaymentRequestDetails);

module.exports = router;
