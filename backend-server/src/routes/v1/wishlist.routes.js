const express = require("express");
const auth = require("../../middlewares/auth");
const { wishlistController } = require("../../controllers");

const router = express.Router();

router.route("/my-wishlist").get(auth("common"), wishlistController.myWishList);

module.exports = router;
