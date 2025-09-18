const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },
  transactionDate: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
