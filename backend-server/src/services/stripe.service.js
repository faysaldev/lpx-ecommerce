const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { orderService, notificationService } = require(".");
const { sendNotificationEmail } = require("./email.service");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Constants
const ALLOWED_SHIPPING_COUNTRIES = ["AE", "US"];
const CHECKOUT_MODE = "payment";

const checkOutSession = async (
  stripeItems,
  customerId,
  orderId,
  email,
  purchaseId
) => {
  try {
    if (!stripeItems || !customerId || !orderId || !email || !purchaseId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
    }

    // FIX: Don't use JSON.stringify - Stripe metadata accepts strings
    // Convert ObjectId to string using .toString()
    const session = await stripe.checkout.sessions.create({
      line_items: stripeItems,
      mode: CHECKOUT_MODE,
      shipping_address_collection: {
        allowed_countries: ALLOWED_SHIPPING_COUNTRIES,
      },
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_URL}`,
      cancel_url: `${process.env.FRONTEND_URL}`,
      metadata: {
        customer_id: customerId.toString(),
        order_id: orderId.toString(), // FIX: Use .toString() instead of JSON.stringify()
        customer_email: email,
        purchase_id: purchaseId,
      },
    });

    return { payment_url: session.url, session_id: session.id };
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to create checkout session: ${error.message}`
    );
  }
};

const checkoutComplete = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Session ID is required");
    }

    // Retrieve both session and line items concurrently
    const [session, lineItems] = await Promise.all([
      stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["payment_intent.payment_method"],
      }),
      stripe.checkout.sessions.listLineItems(sessionId),
    ]);

    return {
      session,
      lineItems: lineItems.data,
    };
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to retrieve checkout session: ${error.message}`
    );
  }
};

const webhookPayload = async (event, req) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Verify webhook signature if secret is configured
  if (endpointSecret) {
    const signature = req.headers["stripe-signature"];

    if (!signature) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Missing stripe-signature header"
      );
    }

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Webhook signature verification failed: ${err.message}`
      );
    }
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;

      case "payment_intent.succeeded":
        console.log("Payment succeeded:", event.data.object.id);
        break;

      case "payment_intent.payment_failed":
        console.log("Payment failed:", event.data.object.id);
        await handlePaymentFailed(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw error;
  }
};

// Helper function to handle checkout completion
const handleCheckoutCompleted = async (checkoutSession) => {
  try {
    // FIX: Parse metadata values - they're now plain strings, not JSON
    const { order_id, customer_id, customer_email, purchase_id } =
      checkoutSession.metadata;

    const { address, email, name, phone } =
      checkoutSession.customer_details || {};
    const shippingDetails = checkoutSession.shipping_details;

    // Validate required data
    if (!order_id) {
      throw new Error("Order ID missing from metadata");
    }

    // Prepare update data
    const updateData = {
      status: "processing",
      shippingInformation: {
        name: name || "",
        email: email || customer_email || "",
        phoneNumber: phone || "",
        address: {
          line1: address?.line1 || "",
          line2: address?.line2 || "",
          city: address?.city || "",
          state: address?.state || "",
          postal_code: address?.postal_code || "",
          country: address?.country || "",
        },
      },
    };

    // Add shipping details if available
    if (shippingDetails) {
      updateData.shippingInformation.shippingDetails = shippingDetails;
    }

    // Update order with shipping information
    const updatedOrder = await orderService.editeSingleOrder(
      order_id, // FIX: This is now a clean string without extra quotes
      updateData
    );

    if (!updatedOrder) {
      throw new Error(`Failed to update order: ${order_id}`);
    }

    // Create notification
    if (customer_id && purchase_id) {
      const notificationData = {
        authorId: customer_id,
        sendTo: customer_id,
        transactionId: purchase_id,
        title: "Order Placed Successfully",
        description: `Your order ${purchase_id} has been received and is being processed`,
        type: "order",
      };

      await notificationService.addNewNotification(notificationData);

      // Send email notification
      if (customer_email || email) {
        const emailBody = {
          username: name || "Customer",
          title: `Order ${purchase_id} Confirmed`,
          description: `We have successfully received your order. Our team is now processing your items, and we will begin shipping your products shortly. You will receive another notification once your order has shipped.`,
          priority: "high",
          type: "order",
          transactionId: purchase_id,
          timestamp: new Date(),
        };

        await sendNotificationEmail(customer_email || email, emailBody);
      }
    }

    console.log(
      `Order ${order_id} updated successfully after payment completion`
    );
  } catch (error) {
    console.error("Error handling checkout completion:", error);
    throw error;
  }
};

// Helper function to handle payment failures
const handlePaymentFailed = async (paymentIntent) => {
  try {
    const { metadata } = paymentIntent;
    const { order_id, customer_email } = metadata || {};

    if (order_id) {
      await orderService.editeSingleOrder(order_id, {
        status: "unpaid",
      });

      console.log(`Order ${order_id} marked as unpaid due to payment failure`);
    }
  } catch (error) {
    console.error("Error handling payment failure:", error);
  }
};

module.exports = {
  checkOutSession,
  checkoutComplete,
  webhookPayload,
};
