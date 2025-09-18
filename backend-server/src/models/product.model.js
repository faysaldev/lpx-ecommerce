const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Vendor who posted the product
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Seller who posted the product
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: ["mint", "near mint", "excellent", "good", "fair", "poor"],
    },
    rarity: {
      type: String,
      enum: ["common", "uncommon", "rare", "ultra rare", "legendary"],
    },
    verified: { type: Boolean, default: false },
    features: [String], // Array of features
    filters: {
      category: { type: String },
      priceRange: { type: String },
      condition: { type: String },
      rarity: { type: String },
      inStock: { type: Boolean },
    },
    images: [String], // URLs to product images
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
