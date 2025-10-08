const mongoose = require("mongoose");
const crypto = require("crypto-js");
const { decryptData } = require("../utils/decrypteHealper");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "234sfdfsdencryption";

const Schema = mongoose.Schema;

const PaymentRequestSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Encrypted Bank Information
    bankName: {
      type: String,
      required: true,
      trim: true,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ["savings", "current", "checking", "other"],
      default: "savings",
    },

    // Contact Information
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },

    withdrawalAmount: {
      type: Number,
      min: 1,
      required: true,
    },

    requestDate: {
      type: Date,
      default: Date.now,
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

/* 🔐 Encryption Helper */
function encryptData(data) {
  return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

/* 🔐 Encrypt bankName & accountNumber before saving */
PaymentRequestSchema.pre("save", function (next) {
  if (this.isModified("bankName")) {
    this.bankName = encryptData(this.bankName);
  }
  if (this.isModified("accountNumber")) {
    this.accountNumber = encryptData(this.accountNumber);
  }
  next();
});

/* 🔓 Method to decrypt sensitive details */
PaymentRequestSchema.methods.decryptBankDetails = function () {
  const decryptedBankName = decryptData(this.bankName);
  const decryptedAccountNumber = decryptData(this.accountNumber);

  return {
    bankName: decryptedBankName,
    accountNumber: decryptedAccountNumber,
  };
};

const PaymentRequest = mongoose.model("PaymentRequest", PaymentRequestSchema);
module.exports = PaymentRequest;
