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

module.exports = {
  getpaymentRequest,
};
