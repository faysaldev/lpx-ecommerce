const express = require("express");
const auth = require("../../middlewares/auth");
const { cartController } = require("../../controllers");

const router = express.Router();

router.route("/my-carts").get(auth("common"), cartController.myCartList);
router.route("/add").post(auth("common"), cartController.addToCartlist);
router
  .route("/remove/:id")
  .delete(auth("common"), cartController.removeToCartlist);

router
  .route("/remove-all")
  .delete(auth("common"), cartController.removeAllCartList);

module.exports = router;
