const express = require("express");
const auth = require("../../middlewares/auth");
const { vendorController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const UPLOADS_FOLDER_USERS = "./public/uploads/vendors";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/my-vendors").get(auth("common"), vendorController.getVendors);
// get the single details of it
router
  .route("/single/:id")
  .get(auth("common"), vendorController.getSingleVendors);
// search the vendors with filter option
router.route("/search").get(auth("common"), vendorController.allVendors);

// search indivual vendor with the owner id and filter with that one
router
  .route("/single-owner/:id")
  .get(auth("common"), vendorController.searchSingleOwnerShop);

// request for becoming a vendor
router
  .route("/request")
  .post(
    auth("common"),
    [uploadUsers.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    vendorController.createVendorRequest
  );

// admin can approve or reject the vendor request
router
  .route("/approved")
  .patch(auth("common"), vendorController.approvedVendorRequest);

module.exports = router;
