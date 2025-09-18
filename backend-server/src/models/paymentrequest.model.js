const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentRequestSchema = new Schema(
  {
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amountRequested: { type: Number, required: true },
    requestDate: { type: Date, default: Date.now },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    invoiceImage: { type: String }, // URL to the invoice image uploaded by the seller
    paidDate: { type: Date },
  },
  { timestamps: true }
);

const PaymentRequest = mongoose.model("PaymentRequest", PaymentRequestSchema);
