const express = require("express");
const auth = require("../../middlewares/auth");
const { paymentCardController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-cards")
  .get(auth("common"), paymentCardController.myPaymentCards);
router
  .route("/add")
  .post(auth("common"), paymentCardController.createPaymentCards);
router
  .route("/cards-details/:id")
  .get(auth("common"), paymentCardController.getPaymentCardSingleDetails);

module.exports = router;
