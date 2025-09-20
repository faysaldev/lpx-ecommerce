const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrayLimit = (val) => val.length <= 8;

const ProductSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Reference to the Vendor who owns the product
    productName: { type: String, required: true }, // Name of the product
    description: { type: String, required: true }, // Description of the product
    category: { type: String, required: true }, // Product category
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
    }, // Condition of the product
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
    }, // Rarity of the product
    tags: { type: [String], default: [] }, // Tags for the product
    price: { type: Number, required: true }, // Price of the product
    optionalPrice: { type: Number }, // Optional price for product
    stockQuantity: { type: Number, required: true }, // Stock quantity
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
    }, // Array of image URLs (max 8 images)
    shipping: {
      shippingCost: { type: Number, required: true }, // Shipping cost
      weight: { type: Number, required: true }, // Weight of the product
      dimensions: { type: Number }, // Dimensions of the product (length, width, height)
    },
    isDraft: { type: Boolean, default: false }, // Boolean to mark the product as a draft
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const ProductSchema = new Schema(
//   {
//     vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Vendor who posted the product
//     seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Seller who posted the product
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 },
//     category: { type: String, required: true },
//     condition: {
//       type: String,
//       enum: ["mint", "near mint", "excellent", "good", "fair", "poor"],
//     },
//     rarity: {
//       type: String,
//       enum: ["common", "uncommon", "rare", "ultra rare", "legendary"],
//     },
//     verified: { type: Boolean, default: false },
//     features: [String], // Array of features
//     filters: {
//       category: { type: String },
//       priceRange: { type: String },
//       condition: { type: String },
//       rarity: { type: String },
//       inStock: { type: Boolean },
//     },
//     images: [String], // URLs to product images
//   },
//   { timestamps: true }
// );

// const Product = mongoose.model("Product", ProductSchema);
