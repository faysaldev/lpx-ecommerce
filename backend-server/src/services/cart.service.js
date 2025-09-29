const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Cart = require("../models/cart.model");

const myCartList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticated");
  }

  const cartItems = await Cart.find({ customer: userId })
    .populate(
      "product",
      "productName condition price stockQuantity category images rarity"
    )
    .populate("vendorId", "storeName")
    .lean();

  return cartItems
    .map((item) => {
      if (!item.product) {
        return null; // Handle missing product gracefully
      }
      const { product } = item;
      return {
        cartId: item._id,
        productName: product.productName,
        vendorName: item.vendorId.storeName,
        condition: product.condition,
        price: product.price,
        stockQuantity: product.stockQuantity,
        productId: product._id,
        category: product.category,
        firstImage: product.images[0],
        rarity: product.rarity,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity,
      };
    })
    .filter(Boolean); // Filter out null values if any
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
