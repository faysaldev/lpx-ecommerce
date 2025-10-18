const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arrayLimit = (val) => val.length <= 8;

const ProductSchema = new Schema(
  {
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    description: { type: String, required: false },
    category: { type: String, required: false },
    condition: { type: String, required: false },
    rarity: { type: String, required: false },
    tags: { type: [String], default: [] },
    price: { type: Number, required: false },
    optionalPrice: { type: Number, required: false },
    stockQuantity: { type: Number, required: false },
    images: {
      type: [String],
      validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
      required: function () {
        return !this.isDraft;
      },
    },
    shipping: {
      shippingCost: { type: Number, required: false },
      dimensions: { type: String, required: false },
    },
    isDraft: { type: Boolean, default: false },
    discountPercentage: { type: Number, default: 0, required: false },
    brand: { type: String, required: false },
    inStock: { type: Boolean, required: true, default: true },
    acceptOffers: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

// Ensure that only a single image is provided when isDraft is true
ProductSchema.pre("save", function (next) {
  if (this.isDraft && this.images.length > 1) {
    // If it's a draft, ensure only 1 image is provided
    this.images = this.images.slice(0, 1); // Take only the first image
  }
  next();
});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;
