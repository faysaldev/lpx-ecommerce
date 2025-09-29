const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key

// Create a payment intent
const createPaymentIntent = async (amount, currency = "usd") => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount is in cents
      currency: currency,
      payment_method_types: ["card"], // Define accepted payment methods
    });
    return paymentIntent;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

// Confirm the payment intent with a payment method ID
const confirmPaymentIntent = async (paymentIntentId, paymentMethodId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
    return paymentIntent;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
};
