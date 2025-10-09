const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
      enum: ["unpaid", "conformed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingInformation: {
      firstName: { type: String },
      lastName: { type: String },
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      streetAddress: { type: String },
      apartment: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
      deliveryInstructions: { type: String },
    },
    billingInformation: {
      // Add a new field for billing information
      firstName: { type: String },
      lastName: { type: String },
      name: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
      streetAddress: { type: String },
      apartment: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String },
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
        vendorId: {
          type: Schema.Types.ObjectId,
          ref: "Vendor",
          required: true,
        },
      },
    ],
    total: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: Number, required: true },
    orderNotes: { type: String },
    coupon: {
      code: { type: String },
      discountPercentage: { type: Number, min: 0, max: 100 },
      isValid: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
