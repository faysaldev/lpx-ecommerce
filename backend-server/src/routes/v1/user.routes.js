const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/user.controller");

const userFileUploadMiddleware = require("../../middlewares/fileUploader");
const UPLOADS_FOLDER = "users";
const imageUpload = userFileUploadMiddleware(UPLOADS_FOLDER);

const router = express.Router();

router.route("/self/in").get(auth("common"), userController.getProfile);

router
  .route("/self/update")
  .patch(
    auth("common"),
    validate(userValidation.updateUser),
    [imageUpload.single("image")],
    userController.updateProfile
  );

module.exports = router;
