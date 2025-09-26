const httpStatus = require("http-status");
const { PaymentCard } = require("../models");
const ApiError = require("../utils/ApiError");

const myPaymentCards = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Fetch all payment cards for the user
  const paymentCards = await PaymentCard.find({ customer: userId });

  // Decrypt card details for each payment card
  const decryptedCards = paymentCards.map((card) => {
    const decryptedDetails = card.decryptCardDetails(); // Decrypt the card details
    return {
      ...card.toObject(), // Convert mongoose document to plain object
      cardNumber: decryptedDetails.cardNumber, // Add decrypted card number
      cvv: decryptedDetails.cvv, // Add decrypted cvv
    };
  });

  return decryptedCards; // Return the decrypted card details
};

const createPaymentCards = async (data) => {
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return PaymentCard.create(data);
};

const getPaymentCardSingleDetails = async (paymentId) => {
  if (!paymentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Payment ID is required");
  }

  // Fetch the payment card by ID
  const card = await PaymentCard.findById(paymentId);

  if (!card) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment card not found");
  }

  // Decrypt the card details
  const decryptedDetails = card.decryptCardDetails();

  // Return the card with decrypted card number and cvv
  return {
    ...card.toObject(),
    cardNumber: decryptedDetails.cardNumber, // Add decrypted card number
    cvv: decryptedDetails.cvv, // Add decrypted cvv
  };
};

module.exports = {
  myPaymentCards,
  createPaymentCards,
  getPaymentCardSingleDetails,
};
