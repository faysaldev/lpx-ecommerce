const express = require("express");
const auth = require("../../middlewares/auth");
const { bankDetailsController } = require("../../controllers");

const router = express.Router();

// Get all bank details for the authenticated user
router
  .route("/my-cards")
  .get(auth("common"), bankDetailsController.myBankDetails);

// Create new bank details for the authenticated user
router
  .route("/add")
  .post(auth("common"), bankDetailsController.createBankDetails);

// Get single bank detail by ID for the authenticated user
router
  .route("/details/:id")
  .get(auth("common"), bankDetailsController.getBankDetailSingle);

// Remove a bank detail by ID
router
  .route("/remove/:id")
  .delete(auth("common"), bankDetailsController.removeBankDetail);

module.exports = router;
