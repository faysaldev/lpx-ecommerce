const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cart.model");
const myCartList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Populate the necessary fields: Product details and Vendor details
  const cartItems = await Cart.find({ customer: userId })
    .populate(
      "product",
      "productName condition price stockQuantity category images rarity originalPrice"
    ) // Populating correct product fields
    .populate("vendorId", "storeName") // Populating vendor's name
    .lean(); // Using .lean() for better performance, return plain JavaScript objects

  // Map through cart items to add quantity and calculate the total price if necessary
  return cartItems.map((item) => ({
    cartId: item._id, // Add the cart _id to the returned object
    productName: item.product.productName, // Correct field name
    vendorName: item.vendorId.storeName, // Correct field name
    condition: item.product.condition,
    money: item.product.price, // Assuming 'money' refers to price
    stockQuantity: item.product.stockQuantity,
    productId: item.product._id,
    category: item.product.category,
    firstImage: item.product.images[0], // Assuming images is an array
    rarity: item.product.rarity,
    originalPrice: item.product.originalPrice,
    quantity: item.quantity, // Quantity in the cart
    totalPrice: item.price * item.quantity, // Assuming you want to calculate the total price
  }));
};

const addToCartlist = async (CartListBody) => {
  if (!CartListBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.create(CartListBody);
};

const removeToCartlist = async (id) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Cart.findByIdAndDelete(id);
};

const removeAllCartList = async (customerId) => {
  if (!customerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  const result = await Cart.deleteMany({ customer: customerId });

  if (result.deletedCount === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No Cart items found for this customer"
    );
  }

  return { message: "All wishlist items removed successfully" };
};

module.exports = {
  myCartList,
  addToCartlist,
  removeToCartlist,
  removeAllCartList,
};
