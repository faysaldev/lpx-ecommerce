const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { productController } = require("../services");

const getMyProducts = catchAsync(async (req, res) => {
  const vendors = await productController.getMyProducts(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

module.exports = {
  getMyProducts,
};
