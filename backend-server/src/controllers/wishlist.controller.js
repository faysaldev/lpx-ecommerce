const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { wishlistService } = require("../services");

const myWishList = catchAsync(async (req, res) => {
  const mywish = await wishlistService.myWishList(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "My Wishlist",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: mywish,
    })
  );
});

const addToWishlist = catchAsync(async (req, res) => {
  const addTowish = await wishlistService.addToWishlist({
    customer: req.user.id,
    products: req.body.productsId,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Add to Wish List",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: addTowish,
    })
  );
});

const removeToWishlist = catchAsync(async (req, res) => {
  const removeTowish = await wishlistService.removeToWishlist(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Remove Wish to Wish List",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: removeTowish,
    })
  );
});

const removeAllFromWishlist = catchAsync(async (req, res) => {
  const removeTowish = await wishlistService.removeAllFromWishlist(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Remove Wish to Wish List",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: removeTowish,
    })
  );
});

module.exports = {
  myWishList,
  addToWishlist,
  removeToWishlist,
  removeAllFromWishlist,
};
