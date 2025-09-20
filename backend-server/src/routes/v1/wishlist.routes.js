const express = require("express");
const auth = require("../../middlewares/auth");
const { wishlistController } = require("../../controllers");

const router = express.Router();

router.route("/my-wishlist").get(auth("common"), wishlistController.myWishList);
router.route("/add").post(auth("common"), wishlistController.addToWishlist);
router
  .route("/remove/:id")
  .delete(auth("common"), wishlistController.removeToWishlist);

module.exports = router;
