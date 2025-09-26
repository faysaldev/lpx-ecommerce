const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { orderService } = require("../services");

const myOrders = catchAsync(async (req, res) => {
  const ordres = await orderService.myOrders(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

const createOrder = catchAsync(async (req, res) => {
  const ordres = await orderService.createOrder({
    customer: req.user.id,
    ...req.body,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

const getOrderSingleDetails = catchAsync(async (req, res) => {
  const ordres = await orderService.getOrderSingleDetails(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "the Orders",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: ordres,
    })
  );
});

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
};
