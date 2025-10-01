const express = require("express");
const auth = require("../../middlewares/auth");
const { adminController } = require("../../controllers");

const router = express.Router();

router.route("/users").get(auth("common"), adminController.getAllUsers);
router.route("/vendors").get(auth("common"), adminController.getAllVendors);
router
  .route("/update-vendor")
  .patch(auth("common"), adminController.updateStatus);

router
  .route("/dashboard")
  .get(auth("common"), adminController.getAdminDashboard);

router
  .route("/product-stats")
  .get(auth("common"), adminController.getAdminProductStats);

router
  .route("/all-products")
  .get(auth("common"), adminController.getAllProductsAdmin);

module.exports = router;
