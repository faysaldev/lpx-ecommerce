const mongoose = require("mongoose");
const crypto = require("crypto-js");
const { decryptData } = require("../utils/decrypteHealper");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "234sfdfsdencryption";

const Schema = mongoose.Schema;

// Helper function to encrypt data
function encryptData(data) {
  return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
}

const BankDetailsSchema = new Schema(
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
    IBAN: {
      type: String,
      required: true,
      trim: true,
    },
    SWIFT: {
      type: String,
      required: true,
      trim: true,
    },
    Currency: {
      type: String,
      required: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Encrypt bankName, IBAN, SWIFT, Currency, and phoneNumber before saving
BankDetailsSchema.pre("save", function (next) {
  if (this.isModified("bankName")) {
    this.bankName = encryptData(this.bankName);
  }
  if (this.isModified("IBAN")) {
    this.IBAN = encryptData(this.IBAN);
  }
  if (this.isModified("SWIFT")) {
    this.SWIFT = encryptData(this.SWIFT);
  }
  if (this.isModified("Currency")) {
    this.Currency = encryptData(this.Currency);
  }
  if (this.isModified("phoneNumber")) {
    this.phoneNumber = encryptData(this.phoneNumber);
  }
  next();
});

// Method to decrypt sensitive details
BankDetailsSchema.methods.decryptBankDetails = function () {
  const decryptedBankName = decryptData(this.bankName);
  const decryptedIBAN = decryptData(this.IBAN);
  const decryptedSWIFT = decryptData(this.SWIFT);
  const decryptedCurrency = decryptData(this.Currency);
  const decryptedPhoneNumber = decryptData(this.phoneNumber);

  return {
    bankName: decryptedBankName,
    IBAN: decryptedIBAN,
    SWIFT: decryptedSWIFT,
    Currency: decryptedCurrency,
    phoneNumber: decryptedPhoneNumber,
  };
};

const BankDetails = mongoose.model("BankDetails", BankDetailsSchema);
module.exports = BankDetails;

// const mongoose = require("mongoose");
// const crypto = require("crypto-js");
// const { decryptData } = require("../utils/decrypteHealper");

// const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "234sfdfsdencryption";

// const Schema = mongoose.Schema;

// // Helper function to encrypt data
// function encryptData(data) {
//   return crypto.AES.encrypt(data, ENCRYPTION_KEY).toString();
// }

// const BankDetailsSchema = new Schema(
//   {
//     seller: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // Encrypted Bank Information
//     bankName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     accountNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     accountType: {
//       type: String,
//       enum: ["Savings", "Current", "Checking", "Others"],
//       default: "Savings",
//     },

//     phoneNumber: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// // Encrypt bankName, accountNumber, and phoneNumber before saving
// BankDetailsSchema.pre("save", function (next) {
//   if (this.isModified("bankName")) {
//     this.bankName = encryptData(this.bankName);
//   }
//   if (this.isModified("accountNumber")) {
//     this.accountNumber = encryptData(this.accountNumber);
//   }
//   if (this.isModified("phoneNumber")) {
//     this.phoneNumber = encryptData(this.phoneNumber);
//   }
//   next();
// });

// // Method to decrypt sensitive details
// BankDetailsSchema.methods.decryptBankDetails = function () {
//   const decryptedBankName = decryptData(this.bankName);
//   const decryptedAccountNumber = decryptData(this.accountNumber);
//   const decryptedPhoneNumber = decryptData(this.phoneNumber);

//   return {
//     bankName: decryptedBankName,
//     accountNumber: decryptedAccountNumber,
//     phoneNumber: decryptedPhoneNumber,
//   };
// };

// const BankDetails = mongoose.model("BankDetails", BankDetailsSchema);
// module.exports = BankDetails;
