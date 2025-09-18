const express = require("express");
const auth = require("../../middlewares/auth");
const { ratingController } = require("../../controllers");

const router = express.Router();

router.route("/my-ratings").get(auth("common"), ratingController.getMyratings);

module.exports = router;
