const express = require("express");
const auth = require("../../middlewares/auth");
const { vendorController } = require("../../controllers");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");
const convertHeicToPngMiddleware = require("../../middlewares/converter");

const UPLOADS_FOLDER_USERS = "./public/uploads/vendors";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/my-vendors").get(auth("common"), vendorController.getVendors);
router.route("/search").get(auth("common"), vendorController.allVendors);
router
  .route("/request")
  .post(
    auth("common"),
    [uploadUsers.single("image")],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    vendorController.createVendorRequest
  );

router
  .route("/approved")
  .patch(auth("common"), vendorController.approvedVendorRequest);

module.exports = router;
