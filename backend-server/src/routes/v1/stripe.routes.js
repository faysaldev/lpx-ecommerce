const express = require("express");
const auth = require("../../middlewares/auth");
const {
  paymentRequestController,
  stripeController,
} = require("../../controllers");
const bodyParser = require("body-parser");

const router = express.Router();

router
  .route("/webhook")
  .post(
    bodyParser.raw({ type: "application/json" }),
    stripeController.webHookPaymentLoad
  );

// checkout session
router
  .route("/checkout")
  .post(auth("common"), stripeController.checkOutSession);

// complete the checkout data
router
  .route("/completion")
  .get(auth("common"), stripeController.checkoutComplete);

module.exports = router;
