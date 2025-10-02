const express = require("express");
const { categoriesController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.route("/all").get(categoriesController.getCategories);
router.route("/add").post(auth("common"), categoriesController.postCategories);

module.exports = router;
