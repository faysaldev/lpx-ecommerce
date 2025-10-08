const express = require("express");
const auth = require("../../middlewares/auth");
const { adminController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const UPLOADS_FOLDER_INVOICES = "./public/uploads/invoices";

const uploadInVoices = userFileUploadMiddleware(UPLOADS_FOLDER_INVOICES);

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

router
  .route("/order-stats")
  .get(auth("common"), adminController.getAdminOrderStats);

router.route("/all-orders").get(auth("common"), adminController.getAllOrders);
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
  .patch(
    auth("common"),
    [uploadInVoices.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_INVOICES),
    adminController.approvedAdminPayment
  );

// todo: analytics overview seciton
router
  .route("/analytics-stats")
  .get(auth("common"), adminController.getAdminAnalyticsDashboardStats);

module.exports = router;
