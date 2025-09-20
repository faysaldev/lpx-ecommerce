const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    storeName: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    website: { type: String },
    socialLinks: { type: [String] },
    experiences: { type: String },
    logo: { type: String },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    averageRating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "approved"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
