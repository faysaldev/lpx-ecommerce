const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { cartService } = require("../services");

const myCartList = catchAsync(async (req, res) => {
  const myCart = await cartService.myCartList(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Cart",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myCart,
    })
  );
});

const addToCartlist = catchAsync(async (req, res) => {
  const addToCart = await cartService.addToCartlist({
    customer: req.user.id,
    products: req.body.products,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Add to Cart List",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: addToCart,
    })
  );
});

const removeToCartlist = catchAsync(async (req, res) => {
  const removeCart = await cartService.removeToCartlist(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Remove Cart to Cart List",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: removeCart,
    })
  );
});

module.exports = {
  myCartList,
  removeToCartlist,
  addToCartlist,
};
