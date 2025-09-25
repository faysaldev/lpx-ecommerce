const express = require("express");
const auth = require("../../middlewares/auth");
const { adminController } = require("../../controllers");

const router = express.Router();

router.route("/users").get(auth("common"), adminController.getAllUsers);
router.route("/vendors").get(auth("common"), adminController.getAllVendors);
router
  .route("/update-vendor")
  .patch(auth("common"), adminController.updateStatus);

module.exports = router;
