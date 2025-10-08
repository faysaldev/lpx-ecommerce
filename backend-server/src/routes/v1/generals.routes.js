const express = require("express");
const { generalsController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/category-all").get(generalsController.getCategories);
router
  .route("/categories/add")
  .post(auth("common"), generalsController.postCategories);
router
  .route("/categories/remove/:id")
  .delete(auth("common"), generalsController.categoriesDelete);

module.exports = router;
