const express = require("express");
const { generalsController } = require("../../controllers");
const auth = require("../../middlewares/auth");

const router = express.Router();

/**
 * 🗂 Category Management
 */
router.route("/category-all").get(generalsController.getCategories);
router
  .route("/categories/add")
  .post(auth("common"), generalsController.postCategories);
router
  .route("/categories/remove/:id")
  .delete(auth("common"), generalsController.categoriesDelete);

/**
 * 🎟 Coupon Management
 */
router.route("/coupon-all").get(generalsController.getCoupons);
router.route("/coupon/add").post(auth("common"), generalsController.postCoupon);
router
  .route("/coupon/remove/:id")
  .delete(auth("common"), generalsController.couponDelete);

/**
 * ⚙️ General Settings
 */
router.route("/").get(generalsController.getGeneral);
router.route("/update").patch(auth("common"), generalsController.updateGeneral);

/**
 * ⚙️ get shipping information
 */
router.route("/shipping-tax").get(generalsController.getShippingTaxEtc);

/**
 * 📋 Conditions
 */
router
  .route("/conditions/add")
  .post(auth("common"), generalsController.addCondition);
router
  .route("/conditions/remove/:index")
  .delete(auth("common"), generalsController.removeCondition);

router.route("/tags").get(generalsController.getTags); // Get tags with search query
router.route("/tags/add").post(auth("common"), generalsController.addTag); // Post a new tag

module.exports = router;
