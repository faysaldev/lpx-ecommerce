const express = require("express");
const { categoriesController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/all").get(categoriesController.getCategories);
router.route("/add").post(auth("common"), categoriesController.postCategories);
router
  .route("/remove/:id")
  .delete(auth("common"), categoriesController.categoriesDelete);

module.exports = router;
