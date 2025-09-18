const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VendorSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Seller who owns the vendor
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  logo: { type: String }, // URL to logo image
  ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }], // Array of ratings for the vendor
  averageRating: { type: Number, default: 0 }, // Calculated average rating
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Vendor = mongoose.model("Vendor", VendorSchema);
