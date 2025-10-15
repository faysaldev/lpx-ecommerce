const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { General } = require("../models");

/** 🗂 CATEGORIES **/
const getCategories = async () => {
  const general = await General.findOne();
  return general ? general.categories : [];
};

const addCategory = async (categoryData) => {
  let general = await General.findOne();

  // ✅ Auto-create if missing
  if (!general) {
    general = await General.create({
      categories: [],
      coupons: [],
      shippingCharge: 0,
      platformCharge: 0,
      estimatedTax: 0,
      conditions: [],
    });
  }

  general.categories.push(categoryData);
  return general.save();
};

const deleteCategory = async (categoryId) => {
  const general = await General.findOne();
  if (!general) throw new ApiError(httpStatus.NOT_FOUND, "General not found");
  general.categories = general.categories.filter(
    (cat) => cat._id.toString() !== categoryId
  );
  return general.save();
};

/** 🎟 COUPONS **/
const getCoupons = async () => {
  const general = await General.findOne();
  return general ? general.coupons : [];
};

const addCoupon = async (couponData) => {
  let general = await General.findOne();

  if (!general) {
    general = await General.create({
      categories: [],
      coupons: [],
      shippingCharge: 0,
      platformCharge: 0,
      estimatedTax: 0,
      conditions: [],
    });
  }

  general.coupons.push(couponData);
  return general.save();
};

const deleteCoupon = async (couponId) => {
  const general = await General.findOne();
  if (!general) throw new ApiError(httpStatus.NOT_FOUND, "General not found");
  general.coupons = general.coupons.filter(
    (cp) => cp._id.toString() !== couponId
  );
  return general.save();
};

/** ⚙️ GENERAL SETTINGS **/
const getGeneral = async () => {
  const general = await General.findOne();
  return general;
};

const postGeneral = async (generalBody) => {
  if (!generalBody)
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide data");

  const existing = await General.findOne();
  if (existing) {
    Object.assign(existing, generalBody);
    return existing.save();
  } else {
    return General.create(generalBody);
  }
};

/** 📋 CONDITIONS **/
const addCondition = async (conditionText) => {
  const general = await General.findOne();
  if (!general) throw new ApiError(httpStatus.NOT_FOUND, "General not found");
  general.conditions.push(conditionText);
  return general.save();
};

const removeCondition = async (index) => {
  const general = await General.findOne();
  if (!general) throw new ApiError(httpStatus.NOT_FOUND, "General not found");
  general.conditions.splice(index, 1);
  return general.save();
};

/** 🗂 CATEGORIES **/
const getShippingTaxEtc = async () => {
  const general = await General.findOne();
  const data = general ? general : [];
  console.log(data);
  return {
    shippingCharge: data.shippingCharge,
    estimatedTax: data.estimatedTax,
  };
};

module.exports = {
  getCategories,
  addCategory,
  deleteCategory,
  getCoupons,
  addCoupon,
  deleteCoupon,
  getGeneral,
  postGeneral,
  addCondition,
  removeCondition,
  getShippingTaxEtc,
};
