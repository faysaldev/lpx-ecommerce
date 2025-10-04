const httpStatus = require("http-status");
const response = require("../config/response");
const { stripeService, orderService } = require("../services");
const {
  forMatOrderData,
  forMatStripeLineItems,
} = require("../utils/StripeCheckoutHelper");

const checkOutSession = async (req, res) => {
  const data = {
    customer: req.user.id,
    ...req.body,
  };
  const orderData = forMatOrderData(data);
  const stripeItems = forMatStripeLineItems(data);
  const orderCreate = await orderService.createOrder(orderData);
  const checkoutData = await stripeService.checkOutSession(
    stripeItems,
    req.user.id,
    orderCreate?._id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Checkout Created",
      status: "OK",
      statusCode: httpStatus.OK,
      data: checkoutData,
    })
  );
};

const checkoutComplete = async (req, res) => {
  const completedData = await stripeService.checkoutComplete(
    req.query.session_id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "checkout Session",
      status: "OK",
      statusCode: httpStatus.OK,
      data: completedData,
    })
  );
};

const webHookPaymentLoad = async (req, res) => {
  let event = req.body;
  const webHookData = await stripeService.webhookPayload(event, req);
  res.status(httpStatus.CREATED).json(
    response({
      message: "checkout Weebhook Hits",
      status: "OK",
      statusCode: httpStatus.OK,
      data: true,
    })
  );
};

module.exports = {
  checkOutSession,
  checkoutComplete,
  webHookPaymentLoad,
};
