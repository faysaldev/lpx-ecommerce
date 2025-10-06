const httpStatus = require("http-status");
const response = require("../config/response");
const { stripeService, orderService } = require("../services");
const {
  forMatOrderData,
  forMatStripeLineItems,
} = require("../utils/StripeCheckoutHelper");
const ApiError = require("../utils/ApiError");

const checkOutSession = async (req, res) => {
  try {
    const data = {
      customer: req.user.id,
      ...req.body,
    };

    const orderData = forMatOrderData(data);
    const stripeItems = forMatStripeLineItems(data);

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
      orderCreate._id,
      req.user.email,
      orderCreate.orderID
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

// const httpStatus = require("http-status");
// const response = require("../config/response");
// const { stripeService, orderService } = require("../services");
// const {
//   forMatOrderData,
//   forMatStripeLineItems,
// } = require("../utils/StripeCheckoutHelper");

// const checkOutSession = async (req, res) => {
//   const data = {
//     customer: req.user.id,
//     ...req.body,
//   };
//   const orderData = forMatOrderData(data);
//   const stripeItems = forMatStripeLineItems(data);
//   const orderCreate = await orderService.createOrder(orderData);
//   const checkoutData = await stripeService.checkOutSession(
//     stripeItems,
//     req.user.id,
//     orderCreate?._id,
//     req.user.email,
//     orderCreate?.orderID
//   );
//   res.status(httpStatus.CREATED).json(
//     response({
//       message: "Checkout Created",
//       status: "OK",
//       statusCode: httpStatus.OK,
//       data: checkoutData,
//     })
//   );
// };

// const checkoutComplete = async (req, res) => {
//   const completedData = await stripeService.checkoutComplete(
//     req.query.session_id
//   );
//   res.status(httpStatus.CREATED).json(
//     response({
//       message: "checkout Session",
//       status: "OK",
//       statusCode: httpStatus.OK,
//       data: completedData,
//     })
//   );
// };

// const webHookPaymentLoad = async (req, res) => {
//   let event = req.body;
//   const webHookData = await stripeService.webhookPayload(event, req);
//   res.status(httpStatus.CREATED).json(
//     response({
//       message: "checkout Weebhook Hits",
//       status: "OK",
//       statusCode: httpStatus.OK,
//       data: true,
//     })
//   );
// };

// module.exports = {
//   checkOutSession,
//   checkoutComplete,
//   webHookPaymentLoad,
// };
