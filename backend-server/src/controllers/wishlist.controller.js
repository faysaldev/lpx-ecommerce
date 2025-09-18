const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { wishlistServicetService } = require("../services");

const myWishList = catchAsync(async (req, res) => {
  const mywish = await wishlistService.myWishList(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: mywish,
    })
  );
});

module.exports = {
  myWishList,
};
