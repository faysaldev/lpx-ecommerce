const express = require("express");
const auth = require("../../middlewares/auth");
const { productController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-products")
  .get(auth("common"), productController.getMyProducts);

module.exports = router;
