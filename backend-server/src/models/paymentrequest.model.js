const mongoose = require("mongoose");
const { BankDetails } = require("./index"); // Import the BankDetails model

const Schema = mongoose.Schema;

const PaymentRequestSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    // Reference to BankDetails model
    bankDetails: {
      type: Schema.Types.ObjectId,
      ref: "BankDetails",
      required: true,
    },

    withdrawalAmount: {
      type: Number,
      min: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "rejected"],
      default: "pending",
    },

    invoiceImage: {
      type: String, // URL to uploaded invoice image
    },

    paidDate: {
      type: Date,
    },
    note: { type: String },
  },
  { timestamps: true }
);

// Method to retrieve bank details for a payment request
PaymentRequestSchema.methods.getBankDetails = async function () {
  const bankDetails = await BankDetails.findById(this.bankDetails).exec();
  return bankDetails ? bankDetails.decryptBankDetails() : null;
};

const PaymentRequest = mongoose.model("PaymentRequest", PaymentRequestSchema);
module.exports = PaymentRequest;
