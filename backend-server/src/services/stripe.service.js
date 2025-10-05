const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { orderService } = require(".");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your Stripe Secret Key

const checkOutSession = async (stripeItems, customer_id, orderId) => {
  // Create the session with the correct line items
  console.log(JSON.stringify(stripeItems));
  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: "payment",
    shipping_address_collection: {
      allowed_countries: ["AE", "US"], // Allowed shipping countries
    },
    billing_address_collection: "required", // Collect billing address, including phone number
    phone_number_collection: {
      enabled: true, // Collect phone number as part of billing details
    },
    success_url: `${process.env.FRONTEND_URL}`,
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

const webhookPayload = async (event, req) => {
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
      return `⚠️ Webhook signature verification failed.`, err.message;
    }
  }
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSession = event.data.object;
      const { order_id, customer_id } = checkoutSession?.metadata;
      const { address, email, name, phone } = checkoutSession?.customer_details;
      const { shipping_details } = checkoutSession?.collected_information;

      const updateData = {
        shippingInformation: {
          address,
          email,
          name: name,
          phoneNumber: phone,
        },
        shipping_details,
      };

      console.log("format Data", updateData);
      break;

    default:
      console.log(`Unhandled event type ${event.type}.`);
  }

  return "WebHook";
};

module.exports = {
  checkOutSession,
  checkoutComplete,
  // checkoutComplete,
  webhookPayload,
};
