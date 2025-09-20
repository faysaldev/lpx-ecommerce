const DraftProductSchema = new Schema({
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Vendor ID reference
  productName: { type: String, required: true }, // Product name
  description: { type: String, required: true }, // Product description
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
  }, // Condition
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
  }, // Rarity
  tags: { type: [String], default: [] },
  price: { type: Number, required: true },
  optionalPrice: { type: Number },
  stockQuantity: { type: Number, required: true },
  images: {
    type: [String],
    validate: [arrayLimit, "{PATH} exceeds the limit of 8"],
  },
  shipping: {
    shippingCost: { type: Number, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: Number },
  },
  isDraft: { type: Boolean, default: true },
});

const DraftProduct = mongoose.model("DraftProduct", DraftProductSchema);
