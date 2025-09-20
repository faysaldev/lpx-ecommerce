const express = require("express");
const auth = require("../../middlewares/auth");
const { productController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-products")
  .get(auth("common"), productController.getMyProducts);

router.route("/add").post(auth("common"), productController.addNewProducts);

router
  .route("/remove/:id")
  .delete(auth("common"), productController.deleteProducts);

router
  .route("/edite/:id")
  .patch(auth("common"), productController.editeProducts);

router
  .route("/details/:id")
  .get(auth("common"), productController.productDetails);

module.exports = router;
