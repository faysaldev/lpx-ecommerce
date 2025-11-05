const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { paymentrequestService, vendorService } = require("../services");

const getpaymentRequest = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sort = "latest",
  } = req.query;

  const paymentRequest = await paymentrequestService.getpaymentRequest({
    userId: req.user.id,
    page,
    limit,
    search,
    status,
    sort,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Paybacks Request",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const createNewPayRequest = catchAsync(async (req, res) => {
  const vendor = await vendorService.getVendorByUserId(req.user.id);
  if (!vendor?.id) {
    return res.status(httpStatus.CREATED).json(
      response({
        message: "No vendor Found under your account",
        status: "OK",
        statusCode: httpStatus.CREATED,
        data: paymentRequest,
      })
    );
  }
  const paymentRequest = await paymentrequestService.createNewPaymentRequest({
    seller: req.user.id,
    vendor: vendor?.id,
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
  const paymentRequest = await paymentrequestService.updatePaymentRequestStatus(
    req.params.id,
    req.body
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

const getEligleWithDrawl = catchAsync(async (req, res) => {
  const paymentRequest = await paymentrequestService.getEligleWithDrawl(
    req.user.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Your Available WithDrawl",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const getWithDrawlPaymentlStats = catchAsync(async (req, res) => {
  const paymentRequest = await paymentrequestService.getWithDrawlPaymentlStats(
    req.user.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: " WithDrawl Stats",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const getpaymentRequestSummery = catchAsync(async (req, res) => {
  const paymentRequest = await paymentrequestService.getpaymentRequestSummery(
    req.user.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: " WithDrawl Stats",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

const getSinglePaymentRequestDetails = catchAsync(async (req, res) => {
  const paymentRequest =
    await paymentrequestService.getSinglePaymentRequestDetails(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: " Request",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: paymentRequest,
    })
  );
});

module.exports = {
  getpaymentRequest,
  createNewPayRequest,
  updatePaymentRequest,
  getEligleWithDrawl,
  getWithDrawlPaymentlStats,
  getpaymentRequestSummery,
  getSinglePaymentRequestDetails,
};
