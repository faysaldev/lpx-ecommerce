// const httpStatus = require("http-status");
// const catchAsync = require("../utils/catchAsync");
// const response = require("../config/response");
// const { paymentrequestService } = require("../services");

const { stripeService } = require("../services");

// const getpaymentRequest = catchAsync(async (req, res) => {
//   const paymentRequest = await paymentrequestService.getpaymentRequest(
//     req.user.id
//   );
//   res.status(httpStatus.CREATED).json(
//     response({
//       message: "All the Paybacks Request",
//       status: "OK",
//       statusCode: httpStatus.CREATED,
//       data: paymentRequest,
//     })
//   );
// });

// Step 1: Create a payment intent and return the client secret to the frontend
const createPayment = async (req, res) => {
  try {
    const { amount, currency } = req.body; // Get the amount and currency from the request body

    // Create a payment intent
    const paymentIntent = await stripeService.createPaymentIntent(
      amount,
      currency
    );

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Step 2: Confirm the payment intent after the user submits their payment method
const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    // Confirm the payment intent
    const paymentIntent = await stripeService.confirmPaymentIntent(
      paymentIntentId,
      paymentMethodId
    );

    if (paymentIntent.status === "succeeded") {
      res.json({ success: true, paymentIntent });
    } else {
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPayment,
  confirmPayment,
};

// module.exports = {
//   getpaymentRequest,
// };
