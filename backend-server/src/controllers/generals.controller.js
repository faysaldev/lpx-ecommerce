const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { generalsService } = require("../services");

const getCategories = catchAsync(async (req, res) => {
  const categories = await generalsService.getCategories();
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
  const categories = await generalsService.addCategory(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All categories",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

const categoriesDelete = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") return;
  const categories = await generalsService.deleteCategory(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category Deleted",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: categories,
    })
  );
});

module.exports = {
  getCategories,
  categoriesDelete,
  postCategories,
};
