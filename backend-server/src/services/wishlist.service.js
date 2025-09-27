const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Wishlist = require("../models/wishlist.model");

const myWishList = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  // Find the wishlist for the given user and populate the necessary fields
  const wishlist = await Wishlist.find({ customer: userId })
    .populate({
      path: "products", // Populate the product details
      select:
        "productName vendor category condition price stockQuantity images rarity", // Select only required fields
      populate: {
        path: "vendor", // Populate the vendor details
        select: "storeName", // Only select the storeName from Vendor
      },
    })
    .exec();

  // Map the wishlist to extract necessary product details
  const result = wishlist.map((item) => {
    const product = item.products; // Access the product from the wishlist

    return {
      productName: product.productName,
      vendorId: product.vendor.id,
      vendorName: product.vendor.storeName, // Access the store name from the vendor object
      condition: product.condition,
      price: product.price,
      stockQuantity: product.stockQuantity,
      _id: product._id,
      category: product.category,
      images: product.images,
      rarity: product.rarity,
    };
  });

  return result;
};

const addToWishlist = async (wishlistBody) => {
  if (!wishlistBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.create(wishlistBody);
};

const removeToWishlist = async (id) => {
  if (!id) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Wishlist.findByIdAndDelete(id);
};

const removeAllFromWishlist = async (customerId) => {
  if (!customerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  // Remove all wishlist items for the customer
  const result = await Wishlist.deleteMany({ customer: customerId });

  if (result.deletedCount === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No wishlist items found for this customer"
    );
  }

  return { message: "All wishlist items removed successfully" };
};

module.exports = {
  myWishList,
  addToWishlist,
  removeToWishlist,
  removeAllFromWishlist,
};
