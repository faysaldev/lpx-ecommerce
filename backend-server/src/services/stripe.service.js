const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const {
  orderService,
  notificationService,
  vendorService,
  productService,
  cartService,
} = require(".");
const {
  sendNotificationEmail,
  sendNotificationEmailWithDelay,
} = require("./email.service");
const { Product, Vendor } = require("../models");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const makeEmailBodyHealper = async ({ name, purchase_id }) => {
  const emailBody = {
    username: name || "Customer",
    title: `Order ${purchase_id} Confirmed`,
    description: `We have successfully received your order. Our team is now processing your items, and we will begin shipping your products shortly. You will receive another notification once your order has shipped.`,
    priority: "high",
    type: "orders",
    transactionId: purchase_id,
    timestamp: new Date(),
  };

  return emailBody;
};

// Constants
const ALLOWED_SHIPPING_COUNTRIES = ["AE", "US"];
const CHECKOUT_MODE = "payment";

const checkOutSession = async (
  stripeItems,
  customerId,
  orderId,
  email,
  purchaseId,
  shippingCost
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
      success_url: `${process.env.FRONTEND_URL}/orders/${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`,
      metadata: {
        customer_id: customerId.toString(),
        order_id: orderId.toString(), // FIX: Use .toString() instead of JSON.stringify()
        customer_email: email,
        purchase_id: purchaseId,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingCost * 100, // Amount in cents (Stripe expects cents)
              currency: "aed", // Use the appropriate currency
            },
            display_name: "Shipping Cost",
          },
        },
      ],
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
const handleCheckoutCompleted = async (checkoutSession) => {
  try {
    // Extract necessary data from checkoutSession metadata
    const { order_id, customer_id, customer_email, purchase_id } =
      checkoutSession.metadata;

    const { address, email, name, phone } =
      checkoutSession.customer_details || {};
    const shippingDetails = checkoutSession.shipping_details;

    // Validate required data
    if (!order_id || !customer_id || !purchase_id) {
      throw new Error(
        "Order ID, Customer ID, or Purchase ID missing from metadata"
      );
    }

    // Prepare update data for the order
    const updateData = {
      status: "confirmed",
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
      order_id,
      updateData
    );
    // Loop through each vendor and update earnings
    const vendorUpdatePromises = updatedOrder.map(async (orderItem) => {
      const { vendorId, productPrice, sellerId, quantity, productId } =
        orderItem;

      // Update vendor earnings by adding the current product price to the previous earnings
      await vendorService.updateVendorMoneyCalculation(vendorId, {
        totalEarnings: productPrice,
      });

      // Create notification for the vendor (seller)
      const vendorNotificationData = {
        authorId: sellerId, // Customer is the author for vendor
        sendTo: sellerId, // Send to seller
        transactionId: purchase_id,
        title: "You Earned from a Sale",
        description: `You earned ${productPrice} from the sale of your product.`,
        type: "vendor",
      };

      await productService.prodoctOrderPlaceDecreaseQuantity(
        productId,
        quantity
      );
      await notificationService.addNewNotification(vendorNotificationData);
    });

    // Wait for all vendor updates to finish
    await Promise.all(vendorUpdatePromises);

    // Create notification for the customer
    const customerNotificationData = {
      authorId: customer_id,
      sendTo: customer_id,
      transactionId: purchase_id,
      title: "Order Placed Successfully",
      description: `Your order ${purchase_id} has been received and is being processed.`,
      type: "orders",
    };

    await notificationService.addNewNotification(customerNotificationData);
    await cartService.removeAllCartList(customer_id);
    // Send email notifications to customer and seller
    const emailBodyCustomer = {
      username: name || "Customer",
      title: `Order ${purchase_id} Confirmed`,
      description: `We have successfully received your order. Our team is now processing your items, and we will begin shipping your products shortly.`,
      priority: "high",
      type: "orders",
      transactionId: purchase_id,
      timestamp: new Date(),
    };

    // await sendNotificationEmail(customer_email || email, emailBodyCustomer);
    await sendNotificationEmailWithDelay(
      customer_email || email,
      emailBodyCustomer,
      2000
    );

    const emailBodySeller = {
      username: name || "Customer",
      title: `New Order: ${purchase_id}`,
      description: `You have received a new order. Please proceed with preparing the items for shipment.`,
      priority: "high",
      type: "orders",
      transactionId: purchase_id,
      timestamp: new Date(),
    };

    // Ensure vendor email is fetched if `updatedOrder.totalItems` is valid and has items
    const vendorEmail =
      updatedOrder.length > 0 ? updatedOrder[0]?.vendorEmail : null;

    if (vendorEmail) {
      await sendNotificationEmail(vendorEmail, emailBodySeller);
      await sendNotificationEmailWithDelay(
        vendorEmail || email,
        emailBodySeller,
        5000
      );
    } else {
      console.error("Vendor email not found for the order.");
    }
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

// cehcking product availablity
const checkProductAvailability = async (data) => {
  console.log(data, "check availablity");
  const results = [];

  // Loop through each item in the data array
  for (let item of data) {
    const { productId, vendorId, quantity } = item;

    try {
      // Check if the product exists
      const product = await Product.findById(productId).populate({
        path: "vendor",
        select: "storeName", // Populate vendor name
      });

      if (!product) {
        // If the product is not found
        results.push({
          productName: `Product with ID ${productId}`, // Return productName here
          message: "Product not found",
        });
        continue;
      }

      // Check if the quantity is available
      if (product.stockQuantity < quantity) {
        // If not enough stock is available
        results.push({
          productName: product.productName, // Return productName here
          message: `Not enough stock for ${product.productName}. Only ${product.stockQuantity} available.`,
        });
        continue;
      }

      results.push({
        productId,
        vendorId,
        available: true,
        quantity: quantity,
        price: product.price,
        image: product.images[0], // Assuming first image is used
        productName: product.productName,
        vendorName: product.vendor
          ? product.vendor.storeName
          : "Unknown Vendor",
      });
    } catch (error) {
      console.error("Error checking product availability:", error);
      results.push({
        productName: `Product with ID ${productId}`, // Return productName here
        message: "Error retrieving product details",
      });
    }
  }

  return results;
};

module.exports = {
  checkOutSession,
  checkoutComplete,
  webhookPayload,
  checkProductAvailability,
};
