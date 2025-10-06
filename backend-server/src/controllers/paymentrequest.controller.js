const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { paymentrequestService } = require("../services");

const getpaymentRequest = catchAsync(async (req, res) => {
  const paymentRequest = await paymentrequestService.getpaymentRequest(
    req.user.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Paybacks Request",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const createNewPaymentRequest = catchAsync(async (req, res) => {
  if (req.user.type != "seller") {
    res.status(httpStatus.CREATED).json(
      response({
        message: "Only seller can requested",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: paymentRequest,
      })
    );
  }
  const paymentRequest = await paymentrequestService.createNewPaymentRequest({
    seller: req.user.id,
    ...req.body,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Created Paybacks Request",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const updatePaymentRequest = catchAsync(async (req, res) => {
  if (req.user.type != "seller") {
    res.status(httpStatus.CREATED).json(
      response({
        message: "Only seller can requested",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: paymentRequest,
      })
    );
  }
  const paymentRequest = await paymentrequestService.updatePaymentRequestStatus(
    req.params.id,
    ...req.body
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Updated the Paybacks Request",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

module.exports = {
  getpaymentRequest,
  createNewPaymentRequest,
  updatePaymentRequest,
};
