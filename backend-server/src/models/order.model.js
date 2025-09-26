const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    paymentCardId: {
      type: Schema.Types.ObjectId,
      ref: "PaymentCard",
      required: true,
    },
    orderID: {
      type: String,
      required: true,
      unique: true,
      default: function () {
        const randomNumber = Math.floor(100 + Math.random() * 900);
        return `#LPX-${Date.now()}-${randomNumber}`;
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingInformation: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      streetAddress: { type: String, required: true },
      apartment: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      deliveryInstructions: { type: String },
    },
    totalItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        image: { type: String }, // Assuming an array of image URLs
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    orderNotes: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;

// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
// const TransactionSchema = new Schema({
//   seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
//   product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
//   quantity: { type: Number, required: true },
//   totalPrice: { type: Number, required: true },
//   status: {
//     type: String,
//     enum: ["pending", "completed", "processing", "shipped", "cancelled"],
//     default: "pending",
//   },
//   transactionDate: { type: Date, default: Date.now },
// });

// const Transaction = mongoose.model("Transaction", TransactionSchema);
// module.exports = Transaction;
