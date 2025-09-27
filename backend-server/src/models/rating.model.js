const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const RatingSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ratingType: {
      type: String,
      enum: ["vendor", "product"],
      default: "vendor",
    },
    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "ratingType", // Dynamically points to the correct collection based on ratingType
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, default: "" },
  },
  { timestamps: true }
);

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;
