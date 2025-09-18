const express = require("express");
const auth = require("../../middlewares/auth");
const { vendorController } = require("../../controllers");

const router = express.Router();

router.route("/my-vendors").get(auth("common"), vendorController.getVendors);

module.exports = router;
