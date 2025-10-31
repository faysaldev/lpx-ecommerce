const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellProductsSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    shippingId: { type: String },
    image: { type: String },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
    status: {
      type: String,
      enum: [
        "unpaid",
        "confirmed",
        "Pickup",
        "Scheduled",
        "Pickup Completed",
        "Not Picked Up",
        "Inscan At Hub",
        "Out For Delivery",
        "Delivered",
        "Undelivered",
        "On-Hold",
        "Reached At Hub",
        "RTO",
        "RTO Delivered",
        "Cancelled",
        "Order Updated",
        "Rescheduled",
        "cancelled",
      ],
      default: "unpaid",
    },
    webhookMeta: {
      description: { type: String },
      hub_name: { type: String },
      event_date_time: { type: Date },
      rider_name: { type: String },
      rider_code: { type: String },
      failure_reason: { type: String },
      pod_image: { type: String },
    },
  },
  { timestamps: true }
);

const SellProducts = mongoose.model("SellProducts", SellProductsSchema);
module.exports = SellProducts;
