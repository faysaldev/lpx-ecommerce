const express = require("express");
const auth = require("../../middlewares/auth");
const { productController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const UPLOADS_FOLDER_USERS = "./public/uploads/products";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router
  .route("/my-products")
  .get(auth("common"), productController.getMyProducts);

router
  .route("/all-products")
  .get(auth("common"), productController.getAllProducts);

router
  .route("/add")
  .post(
    auth("common"),
    [uploadUsers.fields([{ name: "image", maxCount: 8 }])],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    productController.addNewProducts
  );

router
  .route("/remove/:id")
  .delete(auth("common"), productController.deleteProducts);

router
  .route("/edite/:id")
  .patch(
    auth("common"),
    [uploadUsers.fields([{ name: "image", maxCount: 8 }])],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    productController.editeProducts
  );

router.route("/details/:id").get(productController.productDetails);
router
  .route("/quick-details/:id")
  .get(productController.productSingleQuickDetails);

router.get("/search", productController.searchProducts);

module.exports = router;
