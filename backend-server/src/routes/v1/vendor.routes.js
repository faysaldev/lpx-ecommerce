const express = require("express");
const auth = require("../../middlewares/auth");
const { vendorController } = require("../../controllers");

const userFileUploadMiddleware = require("../../middlewares/fileUploader");
const UPLOADS_FOLDER = "vendors";
const imageUpload = userFileUploadMiddleware(UPLOADS_FOLDER);
const router = express.Router();

router.route("/my-vendors").get(auth("common"), vendorController.getVendors);
// get the single details of it
router.route("/single/:id").get(vendorController.getSingleVendors);
// search the vendors with filter option
router.route("/search").get(vendorController.allVendors);

// search indivual vendor with the owner id and filter with that one
router.route("/single-owner/:id").get(vendorController.searchSingleOwnerShop);

// request for becoming a vendor
router
  .route("/request")
  .post(
    auth("common"),
    [imageUpload.single("image")],
    vendorController.createVendorRequest
  );

// admin can approve or reject the vendor request
router
  .route("/approved")
  .patch(auth("common"), vendorController.approvedVendorRequest);

module.exports = router;
