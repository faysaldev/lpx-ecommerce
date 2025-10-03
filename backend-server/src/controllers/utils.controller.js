const httpStatus = require("http-status");
const { utilsService } = require("../services");
const catchAsync = require("../utils/catchAsync");

// Get Featured Products
const getFeaturedProducts = catchAsync(async (req, res) => {
  const featuredProducts = await utilsService.getFeturedProducts();
  res.status(httpStatus.OK).json({
    message: "Featured Products",
    status: "OK",
    statusCode: httpStatus.OK,
    data: featuredProducts,
  });
});

// Get LPS Statistics
const getLpsStatistics = catchAsync(async (req, res) => {
  const statistics = await utilsService.getLpsStatistics();
  res.status(httpStatus.OK).json({
    message: "LPS Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

//has purchased product
const hasUserPurchased = catchAsync(async (req, res) => {
  const statistics = await utilsService.hasUserPurchased({
    userId: req.user.id,
    entityId: req.query.id,
    type: req.query.type,
  });
  res.status(httpStatus.OK).json({
    message: "LPS Statistics",
    status: "OK",
    statusCode: httpStatus.OK,
    data: statistics,
  });
});

module.exports = {
  getFeaturedProducts,
  getLpsStatistics,
  hasUserPurchased,
};
