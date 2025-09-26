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
    logo: { type: String },
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
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
