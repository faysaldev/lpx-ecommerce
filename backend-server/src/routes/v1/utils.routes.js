const express = require("express");
const auth = require("../../middlewares/auth");
const { utilsController } = require("../../controllers");

const router = express.Router();

router.route("/fetures-products").get(utilsController.getFeaturedProducts);
router.route("/statitics").get(utilsController.getLpsStatistics);
router
  .route("/has-user-purchased")
  .get(auth("common"), utilsController.hasUserPurchased);

// header statics
router
  .route("/header-statitics")
  .get(auth("common"), utilsController.headerStatistics);

// get customer dashboard details
router
  .route("/customer-dashboard")
  .get(auth("common"), utilsController.getCustomerDashboard);

// get vendor Dashboard - overview
router
  .route("/vendor/overview")
  .get(auth("common"), utilsController.vendorDashboardOverview);

// get vendor Dashboard - recent order
router
  .route("/vendor/recent-order")
  .get(auth("common"), utilsController.getRecentOrders);

// get vendor Dashboard - products
router
  .route("/vendor/products")
  .get(auth("common"), utilsController.getVendorProducts);

// get vendor analytics
router
  .route("/vendor/analytics")
  .get(auth("common"), utilsController.getVendorDashbordAnalytics);

module.exports = router;
