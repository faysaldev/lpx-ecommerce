const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const WishlistSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Customer who owns the wishlist
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", WishlistSchema);
module.exports = Wishlist;
