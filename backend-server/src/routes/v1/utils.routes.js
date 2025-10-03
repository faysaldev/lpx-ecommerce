const express = require("express");
const auth = require("../../middlewares/auth");
const { utilsController } = require("../../controllers");

const router = express.Router();

router.route("/fetures-products").get(utilsController.getFeaturedProducts);
router.route("/statitics").get(utilsController.getLpsStatistics);
router
  .route("/has-user-purchased")
  .get(auth("common"), utilsController.hasUserPurchased);

module.exports = router;
