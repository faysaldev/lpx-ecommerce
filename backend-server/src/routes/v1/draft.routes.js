const express = require("express");
const auth = require("../../middlewares/auth");
const { draftController } = require("../../controllers");
const convertHeicToPngMiddleware = require("../../middlewares/converter");
const userFileUploadMiddleware = require("../../middlewares/fileUpload");

const UPLOADS_FOLDER_USERS = "./public/uploads/drafts";

const uploadUsers = userFileUploadMiddleware(UPLOADS_FOLDER_USERS);

const router = express.Router();

router.route("/my-draft").get(auth("common"), draftController.getMyDrafts);

router
  .route("/add")
  .post(
    auth("common"),
    [uploadUsers.fields([{ name: "image", maxCount: 8 }])],
    convertHeicToPngMiddleware(UPLOADS_FOLDER_USERS),
    draftController.addNewDrafts
  );

router
  .route("/remove/:id")
  .delete(auth("common"), draftController.deleteDrafts);

router.route("/edite/:id").patch(auth("common"), draftController.editeDraft);

router.route("/details/:id").get(auth("common"), draftController.DraftDetails);

module.exports = router;
