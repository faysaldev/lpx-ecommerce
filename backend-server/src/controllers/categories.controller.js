const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { categoriesService } = require("../services");

const getCategories = catchAsync(async (req, res) => {
  const categories = await categoriesService.getCategories();
  res.status(httpStatus.CREATED).json(
    response({
      message: "All categories",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

const postCategories = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") return;
  const categories = await categoriesService.postCategories(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All categories",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

module.exports = {
  getCategories,
  postCategories,
};
