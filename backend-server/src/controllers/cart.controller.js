const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { cartService } = require("../services");

const getCarts = catchAsync(async (req, res) => {
  const cartsProducts = await cartService.getCarts(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Card Products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: cartsProducts,
    })
  );
});

module.exports = {
  getCarts,
};
