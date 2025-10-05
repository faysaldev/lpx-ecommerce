const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Category = require("../models/categories.model");

const getCategories = async (userId) => {
  return Category.find();
};

const postCategories = async (categoriesBody) => {
  if (!categoriesBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please pass the data");
  }
  return Category.create(categoriesBody);
};

const singleDelete = async (categoryId) => {
  return Category.findByIdAndDelete(categoryId);
};

module.exports = {
  getCategories,
  postCategories,
  singleDelete,
};
