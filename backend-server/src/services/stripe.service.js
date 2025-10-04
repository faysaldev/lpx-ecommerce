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

const checkOutSession = async (stripeItems, customer_id, orderId) => {
  // Create the session with the correct line items
  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["AE", "US"], // Allowed shipping countries
    },
    success_url: `${process.env.FRONTEND_URL}/orders?session_id={CHECKOUT_SESSION_IDy}`,
    cancel_url: `${process.env.FRONTEND_URL}`,
    metadata: {
      customer_id: JSON.stringify(customer_id),
      order_id: JSON.stringify(orderId),
    },
  });
  return { payment_url: session?.url };
};

const checkoutComplete = async (session_id) => {
  try {
    // Retrieve the checkout session
    const sessionPromise = stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent.payment_method"],
    });

    // Retrieve the line items for the session
    const lineItemsPromise = stripe.checkout.sessions.listLineItems(session_id);

    // Wait for both promises to resolve
    const [session, lineItems] = await Promise.all([
      sessionPromise,
      lineItemsPromise,
    ]);

    return {
      session,
      lineItems,
    };
  } catch (error) {
    console.error("Error retrieving session or line items:", error);
  }
};

const webhookPayload = async (event) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return res.sendStatus(400);
    }
  }

  console.log("event type", event.type);
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;
      console.log("Checkout session completed:", checkoutSession);
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  res.send();
};

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  checkOutSession,
  checkoutComplete,
  checkoutComplete,
  webhookPayload,
};
