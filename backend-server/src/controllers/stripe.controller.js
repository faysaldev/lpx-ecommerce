const httpStatus = require("http-status");
const response = require("../config/response");
const { stripeService, orderService, generalsService } = require("../services");
const {
  forMatOrderData,
  forMatStripeLineItems,
} = require("../utils/StripeCheckoutHelper");
const ApiError = require("../utils/ApiError");

const checkOutSession = async (req, res) => {
  try {
    const data = req.body;
    const productDetails = await stripeService.checkProductAvailability(
      req.body
    );

    const shippingTax = await generalsService.getShippingTaxEtc();
    console.log(shippingTax);

    const orderData = forMatOrderData({
      productDetails,
      customer: req.user.id,
      shippingCost: shippingTax?.shippingCharge,
      taxCost: shippingTax?.estimatedTax,
      orderNotes: "",
      cupon: {},
    });
    const stripeItems = forMatStripeLineItems(productDetails);

    const orderCreate = await orderService.createOrder(orderData);

    if (!orderCreate) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to create order"
      );
    }

    const checkoutData = await stripeService.checkOutSession(
      stripeItems,
      req.user.id,
      orderCreate.id,
      req.user.email,
      orderCreate.orderID,
      orderCreate?.shipping
    );

    res.status(httpStatus.OK).json(
      response({
        message: "Checkout session created successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: checkoutData,
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create checkout session"
    );
  }
};

const checkoutComplete = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Session ID is required");
    }

    const completedData = await stripeService.checkoutComplete(session_id);

    res.status(httpStatus.OK).json(
      response({
        message: "Checkout session retrieved successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: completedData,
      })
    );
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to retrieve checkout session"
    );
  }
};

const webHookPaymentLoad = async (req, res) => {
  try {
    await stripeService.webhookPayload(req.body, req);

    res.status(httpStatus.OK).json(
      response({
        message: "Webhook processed successfully",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { received: true },
      })
    );
  } catch (error) {
    console.error("Webhook error:", error);
    // Return 200 to Stripe to prevent retries for validation errors
    res.status(httpStatus.OK).json(
      response({
        message: "Webhook received",
        status: "OK",
        statusCode: httpStatus.OK,
        data: { received: true },
      })
    );
  }
};

module.exports = {
  checkOutSession,
  checkoutComplete,
  webHookPaymentLoad,
};
