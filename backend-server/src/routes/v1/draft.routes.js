const express = require("express");
const auth = require("../../middlewares/auth");
const { draftController } = require("../../controllers");

const router = express.Router();

router.route("/my-draft").get(auth("common"), draftController.getMyDrafts);

router.route("/add").post(auth("common"), draftController.addNewDrafts);

router
  .route("/remove/:id")
  .delete(auth("common"), draftController.deleteDrafts);

router.route("/edite/:id").patch(auth("common"), draftController.editeDraft);

router.route("/details/:id").get(auth("common"), draftController.DraftDetails);

module.exports = router;
