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
  const { customer, product, vendorId, quantity, price } = CartListBody;

  // Ensure that the product, vendorId, and customer are provided
  if (!customer || !product || !vendorId || !price) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Required fields missing");
  }

  // Check if the product is already in the cart for this customer and vendor
  const existingCartItem = await Cart.findOne({
    customer: customer,
    product: product,
    vendorId: vendorId,
  });

  if (existingCartItem) {
    // If the product is already in the cart, update the quantity and totalPrice
    let newQuantity = existingCartItem.quantity;

    // If quantity is provided, update accordingly, otherwise add 1 by default
    newQuantity += quantity ? quantity : 1;

    // Recalculate the total price
    const newTotalPrice = newQuantity * price;

    // Update the cart item with the new quantity and total price
    existingCartItem.quantity = newQuantity;
    existingCartItem.totalPrice = newTotalPrice;

    // Save the updated cart item
    await existingCartItem.save();

    return existingCartItem; // Return the updated cart item
  } else {
    // If the product isn't already in the cart, create a new entry
    const totalPrice = quantity * price; // Calculate total price

    const newCartItem = await Cart.create({
      customer,
      product,
      vendorId,
      quantity,
      price,
      totalPrice,
    });

    return newCartItem; // Return the newly added cart item
  }
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
