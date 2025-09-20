const express = require("express");
const auth = require("../../middlewares/auth");
const { vendorController } = require("../../controllers");

const router = express.Router();

router.route("/my-vendors").get(auth("common"), vendorController.getVendors);
router.route("/search").get(auth("common"), vendorController.allVendors);
router
  .route("/request")
  .post(auth("common"), vendorController.createVendorRequest);

router
  .route("/approved")
  .patch(auth("common"), vendorController.approvedVendorRequest);

module.exports = router;
