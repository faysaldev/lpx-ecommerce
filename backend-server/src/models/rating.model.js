const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const RatingSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Customer who is giving the rating
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true }, // Vendor being rated
    rating: { type: Number, required: true, min: 1, max: 5 }, // Rating scale from 1 to 5
    review: { type: String, required: false }, // Optional review comment
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);
