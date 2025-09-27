const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrayLimit = (val) => val.length <= 8;

const DraftProductSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String },
    description: { type: String },
    category: { type: String },
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
    },
    tags: { type: [String], default: [] },
    price: { type: Number },
    optionalPrice: { type: Number },
    stockQuantity: { type: Number },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
    },
    shipping: {
      shippingCost: { type: Number },
      weight: { type: Number },
      dimensions: { type: String }, // Dimensions of the product (length, width, height)
    },
    isDraft: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0 },
    brand: { type: String },
    inStock: { type: Boolean, default: true },
    acceptOffers: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const DraftProduct = mongoose.model("DraftProduct", DraftProductSchema);

module.exports = DraftProduct;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const arrayLimit = (val) => val.length <= 8;

// const DraftProductSchema = new Schema({
//   vendor: { type: Schema.Types.ObjectId, ref: "Vendor" }, // Vendor ID reference
//   productName: { type: String }, // Product name
//   description: { type: String }, // Product description
//   category: { type: String }, // Product category
//   condition: {
//     type: String,
//     enum: [
//       "Mint",
//       "Near Mint",
//       "Excellent",
//       "Very Good",
//       "Good",
//       "Fair",
//       "Poor",
//       "CGC Graded",
//       "PSA Graded",
//       "BGS Graded",
//     ],
//   }, // Condition
//   rarity: {
//     type: String,
//     enum: [
//       "Common",
//       "Uncommon",
//       "Rare",
//       "Super Rare",
//       "Ultra Rare",
//       "Secret Rare",
//       "Legendary",
//       "Mythic",
//       "Promo",
//       "First Edition",
//     ],
//   }, // Rarity
//   tags: { type: [String], default: [] },
//   price: { type: Number },
//   optionalPrice: { type: Number },
//   stockQuantity: { type: Number },
//   images: {
//     type: [String],
//     validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
//   },
//   shipping: {
//     shippingCost: { type: Number },
//     weight: { type: Number },
//     dimensions: { type: String },
//   },
//   isDraft: { type: Boolean, default: true },
// });

// const DraftProduct = mongoose.model("DraftProduct", DraftProductSchema);

// module.exports = DraftProduct;
