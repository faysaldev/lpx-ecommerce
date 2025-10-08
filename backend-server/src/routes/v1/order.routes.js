const express = require("express");
const auth = require("../../middlewares/auth");
const { orderController } = require("../../controllers");

const router = express.Router();

router.route("/my-order").get(auth("common"), orderController.myOrders);
router.route("/add").post(auth("common"), orderController.createOrder);
router
  .route("/order-details/:id")
  .get(auth("common"), orderController.getOrderSingleDetails);

router
  .route("/invoice/:id")
  .get(auth("common"), orderController.getOrderSingleDetailsInvoice);

module.exports = router;
