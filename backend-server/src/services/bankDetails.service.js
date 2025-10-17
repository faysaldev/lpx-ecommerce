const httpStatus = require("http-status");
const { BankDetails } = require("../models");
const ApiError = require("../utils/ApiError");

const myBankDetails = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Fetch all bank details for the user
  const bankDetails = await BankDetails.find({ seller: userId });

  // Decrypt the bank details for each entry
  const decryptedBankDetails = bankDetails.map((bank) => {
    const decryptedDetails = bank.decryptBankDetails(); // Decrypt bank details
    return {
      ...bank.toObject(), // Convert mongoose document to plain object
      bankName: decryptedDetails.bankName, // Add decrypted bankName
      accountNumber: decryptedDetails.accountNumber, // Add decrypted accountNumber
      phoneNumber: decryptedDetails.phoneNumber, // Add decrypted phone number
    };
  });

  return decryptedBankDetails; // Return the decrypted bank details
};

const createBankDetails = async (data) => {
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  return BankDetails.create(data); // Create new bank detail entry
};

const getBankDetailSingle = async (bankDetailId) => {
  if (!bankDetailId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bank Detail ID is required");
  }

  // Fetch the bank details by ID
  const bankDetail = await BankDetails.findById(bankDetailId);

  if (!bankDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank Detail not found");
  }

  // Decrypt the bank details
  const decryptedDetails = bankDetail.decryptBankDetails();

  // Return the bank details with decrypted information
  return {
    ...bankDetail.toObject(),
    bankName: decryptedDetails.bankName, // Add decrypted bankName
    accountNumber: decryptedDetails.accountNumber, // Add decrypted accountNumber
    phoneNumber: decryptedDetails.phoneNumber, // Add decrypted phoneNumber
  };
};

const removeBankDetail = async (bankDetailId) => {
  if (!bankDetailId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Bank Detail ID is required");
  }

  // Find and remove the bank detail by ID
  const bankDetail = await BankDetails.findByIdAndDelete(bankDetailId);

  if (!bankDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, "Bank Detail not found");
  }

  return bankDetail; // Return the removed bank detail
};

module.exports = {
  myBankDetails,
  createBankDetails,
  getBankDetailSingle,
  removeBankDetail,
};

// const httpStatus = require("http-status");
// const { PaymentCard } = require("../models");
// const ApiError = require("../utils/ApiError");

// const myPaymentCards = async (userId) => {
//   if (!userId) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
//   }

//   // Fetch all payment cards for the user
//   const paymentCards = await PaymentCard.find({ customer: userId });

//   // Decrypt card details for each payment card
//   const decryptedCards = paymentCards.map((card) => {
//     const decryptedDetails = card.decryptCardDetails(); // Decrypt the card details
//     return {
//       ...card.toObject(), // Convert mongoose document to plain object
//       cardNumber: decryptedDetails.cardNumber, // Add decrypted card number
//       cvv: decryptedDetails.cvv, // Add decrypted cvv
//     };
//   });

//   return decryptedCards; // Return the decrypted card details
// };

// const createPaymentCards = async (data) => {
//   if (!data) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
//   }
//   return PaymentCard.create(data);
// };

// const getPaymentCardSingleDetails = async (paymentId) => {
//   if (!paymentId) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "Payment ID is required");
//   }

//   // Fetch the payment card by ID
//   const card = await PaymentCard.findById(paymentId);

//   if (!card) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Payment card not found");
//   }

//   // Decrypt the card details
//   const decryptedDetails = card.decryptCardDetails();

//   // Return the card with decrypted card number and cvv
//   return {
//     ...card.toObject(),
//     cardNumber: decryptedDetails.cardNumber, // Add decrypted card number
//     cvv: decryptedDetails.cvv, // Add decrypted cvv
//   };
// };

// module.exports = {
//   myPaymentCards,
//   createPaymentCards,
//   getPaymentCardSingleDetails,
// };
