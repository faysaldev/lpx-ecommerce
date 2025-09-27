const express = require("express");
const auth = require("../../middlewares/auth");
const { ratingController } = require("../../controllers");

const router = express.Router();

router
  .route("/my-ratings/:type")
  .get(auth("common"), ratingController.getMyratings);
router.route("/add").post(auth("common"), ratingController.addNewRatings);
router
  .route("/update/:id")
  .patch(auth("common"), ratingController.updateRatings);
router
  .route("/remove/:id")
  .delete(auth("common"), ratingController.removeRatings);

module.exports = router;
