const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrayLimit = (val) => val.length <= 8;

const ProductSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: [
        "Mint",
        "Near Mint",
        "Excellent",
        "Very Good",
        "Good",
        "Fair",
        "Poor",
        "CGC Graded",
        "PSA Graded",
        "BGS Graded",
      ],
      required: true,
    },
    rarity: {
      type: String,
      enum: [
        "Common",
        "Uncommon",
        "Rare",
        "Super Rare",
        "Ultra Rare",
        "Secret Rare",
        "Legendary",
        "Mythic",
        "Promo",
        "First Edition",
      ],
      required: true,
    },
    tags: { type: [String], default: [] },
    price: { type: Number, required: true },
    optionalPrice: { type: Number },
    stockQuantity: { type: Number, required: true },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
    },
    shipping: {
      shippingCost: { type: Number, required: true }, // Shipping cost
      weight: { type: Number, required: true }, // Weight of the product
      dimensions: { type: String }, // Dimensions of the product (length, width, height)
    },
    isDraft: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
