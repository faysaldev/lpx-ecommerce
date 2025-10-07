const express = require("express");
const { generalsController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/all").get(generalsController.getCategories);
router.route("/add").post(auth("common"), generalsController.postCategories);
router
  .route("/remove/:id")
  .delete(auth("common"), generalsController.categoriesDelete);

module.exports = router;
