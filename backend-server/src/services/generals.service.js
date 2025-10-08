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
};

// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const { General } = require("../models");
// // ✅ Get only categories list
// const getCategories = async () => {
//   const general = await General.findOne();

//   console.log(general);

//   return general.categories;
// };

// // ✅ Get all general settings
// const getGeneral = async () => {
//   const general = await General.findOne();
//   return general;
// };

// // ✅ Create or update general settings
// const postGeneral = async (generalBody) => {
//   if (!generalBody) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Please provide data");
//   }

//   const existingGeneral = await General.findOne();
//   if (existingGeneral) {
//     Object.assign(existingGeneral, generalBody);
//     return existingGeneral.save();
//   } else {
//     return General.create(generalBody);
//   }
// };

// // ✅ Add a new category
// const addCategory = async (categoryData) => {
//   const general = await General.findOne();
//   if (!general) {
//     throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
//   }
//   general.categories.push(categoryData);
//   return general.save();
// };

// // ✅ Delete a single category by ID
// const deleteCategory = async (categoryId) => {
//   const general = await General.findOne();
//   if (!general) {
//     throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
//   }
//   general.categories = general.categories.filter(
//     (cat) => cat._id.toString() !== categoryId
//   );
//   return general.save();
// };

// // ✅ Add a new coupon
// const addCoupon = async (couponData) => {
//   const general = await General.findOne();
//   if (!general) {
//     throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
//   }
//   general.coupons.push(couponData);
//   return general.save();
// };

// // ✅ Delete a single coupon by ID
// const deleteCoupon = async (couponId) => {
//   const general = await General.findOne();
//   if (!general) {
//     throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
//   }
//   general.coupons = general.coupons.filter(
//     (cp) => cp._id.toString() !== couponId
//   );
//   return general.save();
// };

// module.exports = {
//   getGeneral,
//   postGeneral,
//   getCategories,
//   addCategory,
//   deleteCategory,
//   addCoupon,
//   deleteCoupon,
// };

// // const httpStatus = require("http-status");
// // const ApiError = require("../utils/ApiError");
// // const Category = require("../models/categories.model");

// // const getCategories = async (userId) => {
// //   return Category.find();
// // };

// // const postCategories = async (categoriesBody) => {
// //   if (!categoriesBody) {
// //     throw new ApiError(httpStatus.BAD_REQUEST, "Please pass the data");
// //   }
// //   return Category.create(categoriesBody);
// // };

// // const singleDelete = async (categoryId) => {
// //   return Category.findByIdAndDelete(categoryId);
// // };

// // module.exports = {
// //   getCategories,
// //   postCategories,
// //   singleDelete,
// // };
