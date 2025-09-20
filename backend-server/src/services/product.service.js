const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Product = require("../models/product.model");

const getMyProducts = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.find({ seller: userId });
};

const addNewProducts = async (productsBody) => {
  if (!productsBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.create(productsBody);
};

const productDetails = async (productsId) => {
  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.findById(productsId);
};

const editeProducts = async (productsId, productsData) => {
  console.log(productsId, productsData);

  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Use findByIdAndUpdate to update the product based on its ID
  return Product.findByIdAndUpdate(productsId, productsData, { new: true });
  // The `{ new: true }` option ensures the returned document is the updated one.
};

const deleteProducts = async (productsId) => {
  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.findByIdAndDelete(productsId);
};

module.exports = {
  getMyProducts,
  addNewProducts,
  productDetails,
  editeProducts,
  deleteProducts,
};
