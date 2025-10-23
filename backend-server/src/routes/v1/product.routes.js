const express = require("express");
const auth = require("../../middlewares/auth");
const { productController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUploader");

// const UPLOADS_FOLDER_USERS = "./public/uploads/products";

// const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const UPLOADS_FOLDER = "products";

const imageUpload = userFileUploadMiddleware(UPLOADS_FOLDER);

const router = express.Router();

router
  .route("/my-products")
  .get(auth("common"), productController.getMyProducts);

router
  .route("/all-products")
  .get(auth("common"), productController.getAllProducts);

router
  .route("/add/:type")
  .post(
    auth("common"),
    [imageUpload.fields([{ name: "image", maxCount: 8 }])],
    productController.addNewProducts
  );
router
  .route("/remove/:id")
  .delete(auth("common"), productController.deleteProducts);

router
  .route("/edite/:id")
  .patch(
    auth("common"),
    [imageUpload.fields([{ name: "image", maxCount: 8 }])],
    productController.editeProducts
  );

router.route("/details/:id").get(productController.productDetails);
router
  .route("/quick-details/:id")
  .get(productController.productSingleQuickDetails);

router.get("/search", productController.searchProducts);

module.exports = router;
