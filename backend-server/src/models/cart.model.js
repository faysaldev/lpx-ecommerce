const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Customer who owns the cart
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
