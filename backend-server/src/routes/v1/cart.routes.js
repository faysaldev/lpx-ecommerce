const express = require("express");
const auth = require("../../middlewares/auth");
const { cartController } = require("../../controllers");

const router = express.Router();

router.route("/my-carts-products").get(auth("common"), cartController.getCarts);

module.exports = router;
