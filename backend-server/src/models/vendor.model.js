const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerName: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    storeName: { type: String, required: true },
    storePhoto: { type: String },
    email: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    website: { type: String },
    socialLinks: [
      {
        type: { type: String, required: true },
        username: { type: String, required: true },
      },
    ],
    experiences: { type: String },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    averageRating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "suspended", "rejected"],
      default: "pending",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    contactEmail: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    location: { type: String },
    storePolicies: {
      returnPolicy: { type: String },
      shippingPolicy: { type: String },
    },
    productsCount: { type: Number, default: 0 },
    availableWithdrawl: { type: Number, default: 0 },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalWithDrawal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
