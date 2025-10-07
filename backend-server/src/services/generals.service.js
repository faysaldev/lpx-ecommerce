const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { General } = require("../models");

// ✅ Get only categories list
const getCategories = async () => {
  const general = await General.findOne();
  if (!general) {
    throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
  }
  return general.categories;
};

// ✅ Get all general settings
const getGeneral = async () => {
  const general = await General.findOne();
  return general;
};

// ✅ Create or update general settings
const postGeneral = async (generalBody) => {
  if (!generalBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide data");
  }

  const existingGeneral = await General.findOne();
  if (existingGeneral) {
    Object.assign(existingGeneral, generalBody);
    return existingGeneral.save();
  } else {
    return General.create(generalBody);
  }
};

// ✅ Add a new category
const addCategory = async (categoryData) => {
  const general = await General.findOne();
  if (!general) {
    throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
  }
  general.categories.push(categoryData);
  return general.save();
};

// ✅ Delete a single category by ID
const deleteCategory = async (categoryId) => {
  const general = await General.findOne();
  if (!general) {
    throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
  }
  general.categories = general.categories.filter(
    (cat) => cat._id.toString() !== categoryId
  );
  return general.save();
};

// ✅ Add a new coupon
const addCoupon = async (couponData) => {
  const general = await General.findOne();
  if (!general) {
    throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
  }
  general.coupons.push(couponData);
  return general.save();
};

// ✅ Delete a single coupon by ID
const deleteCoupon = async (couponId) => {
  const general = await General.findOne();
  if (!general) {
    throw new ApiError(httpStatus.NOT_FOUND, "General settings not found");
  }
  general.coupons = general.coupons.filter(
    (cp) => cp._id.toString() !== couponId
  );
  return general.save();
};

module.exports = {
  getGeneral,
  postGeneral,
  getCategories,
  addCategory,
  deleteCategory,
  addCoupon,
  deleteCoupon,
};

// const httpStatus = require("http-status");
// const ApiError = require("../utils/ApiError");
// const Category = require("../models/categories.model");

// const getCategories = async (userId) => {
//   return Category.find();
// };

// const postCategories = async (categoriesBody) => {
//   if (!categoriesBody) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Please pass the data");
//   }
//   return Category.create(categoriesBody);
// };

// const singleDelete = async (categoryId) => {
//   return Category.findByIdAndDelete(categoryId);
// };

// module.exports = {
//   getCategories,
//   postCategories,
//   singleDelete,
// };
