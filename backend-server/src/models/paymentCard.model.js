const mongoose = require("mongoose");
const { decryptData } = require("../utils/decrypteHealper");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "234sfdfsdencryption";

const crypto = require("crypto-js");

const Schema = mongoose.Schema;
const PaymentCardSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    cardNumber: { type: String, required: true, minlength: 16, maxlength: 16 },
    cardHolderName: { type: String, required: true },
    expiryDate: { type: String, required: true }, // Expiry date (MM/YYYY format)
    cvv: { type: String, required: true, minlength: 3, maxlength: 3 },
  },
  { timestamps: true }
);

PaymentCardSchema.pre("save", function (next) {
  if (this.isModified("cardNumber") || this.isModified("cvv")) {
    this.cardNumber = encryptData(this.cardNumber);
    this.cvv = encryptData(this.cvv);
  }
  next();
});

function encryptData(data) {
  return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

PaymentCardSchema.methods.decryptCardDetails = function () {
  const decryptedCardNumber = decryptData(this.cardNumber);
  const decryptedCvv = decryptData(this.cvv);

  return {
    cardNumber: decryptedCardNumber,
    cvv: decryptedCvv,
  };
};

const PaymentCard = mongoose.model("PaymentCard", PaymentCardSchema);
module.exports = PaymentCard;
