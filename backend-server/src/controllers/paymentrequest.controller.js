const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { paymentrequestService } = require("../services");

const getpaymentRequest = catchAsync(async (req, res) => {
  const {
    page = 1, // Page number, default is 1
    limit = 10, // Number of records per page, default is 10
    search = "", // Search query, default is empty string
    status = "all", // Status filter, default is 'all'
    sort = "latest", // Sorting option, default is 'latest'
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
  // console.log(req.user.type);
  // if (req.user.type != "seller") {
  //   res.status(httpStatus.CREATED).json(
  //     response({
  //       message: "Only seller can requested",
  //       status: "OK",
  //       statusCode: httpStatus.CREATED,
  //       data: "You are not authorized",
  //     })
  //   );
  // }
  console.log(req.body);
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
  createNewPayRequest,
  updatePaymentRequest,
};
