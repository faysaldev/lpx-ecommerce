const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { paymentCardService } = require("../services");

const myPaymentCards = catchAsync(async (req, res) => {
  const cards = await paymentCardService.myPaymentCards(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Cards",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: cards,
    })
  );
});

const createPaymentCards = catchAsync(async (req, res) => {
  const cards = await paymentCardService.createPaymentCards({
    customer: req.user.id,
    ...req.body,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "the Cards",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: cards,
    })
  );
});

const getPaymentCardSingleDetails = catchAsync(async (req, res) => {
  const cards = await paymentCardService.getPaymentCardSingleDetails(
    req.params.id
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "the Cards",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: cards,
    })
  );
});

module.exports = {
  myPaymentCards,
  createPaymentCards,
  getPaymentCardSingleDetails,
};
