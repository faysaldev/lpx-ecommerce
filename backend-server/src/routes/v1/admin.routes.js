const express = require("express");
const auth = require("../../middlewares/auth");
const { adminController, orderController } = require("../../controllers");
const router = express.Router();

router.route("/users").get(auth("common"), adminController.getAllUsers);
router
  .route("/remove-user/:id")
  .delete(auth("common"), adminController.deleteUserAccount);
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

router
  .route("/order-stats")
  .get(auth("common"), adminController.getAdminOrderStats);

router.route("/all-orders").get(auth("common"), adminController.getAllOrders);

// update order stats
router
  .route("/order-status-update/:id")
  .patch(auth("common"), orderController.getOrderSingleStatusUpdate);

// all the payment request with statitics

router
  .route("/all-payment-requests")
  .get(auth("common"), adminController.getAdminAllPaymentRequests);

router
  .route("/all-payment-stats")
  .get(auth("common"), adminController.getAdminPaymentRequestStats);

// get vendor pay summeries
router
  .route("/pay-vendor-summaries")
  .get(auth("common"), adminController.getAdminVendorSummary);

router
  .route("/pay-financial-overview")
  .get(auth("common"), adminController.getAdminFinancialOverview);

// approving the payment and uploading invoice
router
  .route("/payment-completed/:id")
  .patch(auth("common"), adminController.approvedAdminPayment);

// recent activites, and recent

router
  .route("/analytics-recent-trends")
  .get(auth("common"), adminController.getAdminRecentAnalyticsTrends);

router
  .route("/analytics-top-selling-categories")
  .get(auth("common"), adminController.getAdminTopCategoriesBySales);

// todo: analytics overview seciton
router
  .route("/analytics-stats")
  .get(auth("common"), adminController.getAdminAnalyticsDashboardStats);
router
  .route("/analytics-total-sales")
  .get(auth("common"), adminController.getAdminAnalyticsTotalSales);

router
  .route("/analytics-total-users")
  .get(auth("common"), adminController.getAdminAnalyticsTotalUserTrends);

router
  .route("/analytics-total-products")
  .get(auth("common"), adminController.getAdminAnalyticsTotalProductTrends);

router
  .route("/analytics-total-revinue")
  .get(auth("common"), adminController.getAdminAnalyticsTotalRevinueTrends);

module.exports = router;
