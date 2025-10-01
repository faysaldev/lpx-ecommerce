const express = require("express");
const auth = require("../../middlewares/auth");
const {
  paymentRequestController,
  stripeController,
} = require("../../controllers");

const router = express.Router();

router
  .route("/create-payment-intent")
  .post(auth("common"), stripeController.createPayment);

router
  .route("/confirm-payment")
  .post(auth("common"), stripeController.confirmPayment);

module.exports = router;
