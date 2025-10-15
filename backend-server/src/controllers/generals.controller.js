const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { generalsService } = require("../services");

/**
 * 📦 Categories
 */
const getCategories = catchAsync(async (req, res) => {
  const categories = await generalsService.getCategories();
  res.status(httpStatus.OK).json(
    response({
      message: "All categories",
      status: "OK",
      statusCode: httpStatus.OK,
      data: categories,
    })
  );
});

/**
 * 📦 Categories
 */
const getShippingTaxEtc = catchAsync(async (req, res) => {
  const shippingCharge = await generalsService.getShippingTaxEtc();
  res.status(httpStatus.OK).json(
    response({
      message: "Shipping Charge And Tax",
      status: "OK",
      statusCode: httpStatus.OK,
      data: shippingCharge,
    })
  );
});

const postCategories = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.addCategory(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Category added successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

const categoriesDelete = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.deleteCategory(req.params.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Category deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

/**
 * 🎟 Coupons
 */
const getCoupons = catchAsync(async (req, res) => {
  const coupons = await generalsService.getCoupons();
  res.status(httpStatus.OK).json(
    response({
      message: "All coupons",
      status: "OK",
      statusCode: httpStatus.OK,
      data: coupons,
    })
  );
});

const postCoupon = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.addCoupon(req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Coupon added successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

const couponDelete = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.deleteCoupon(req.params.id);
  res.status(httpStatus.OK).json(
    response({
      message: "Coupon deleted successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

/**
 * ⚙️ General Settings
 */
const getGeneral = catchAsync(async (req, res) => {
  const general = await generalsService.getGeneral();
  res.status(httpStatus.OK).json(
    response({
      message: "General settings",
      status: "OK",
      statusCode: httpStatus.OK,
      data: general,
    })
  );
});

const updateGeneral = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const updated = await generalsService.postGeneral(req.body);
  res.status(httpStatus.OK).json(
    response({
      message: "General settings updated successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: updated,
    })
  );
});

/**
 * 📋 Conditions
 */
const addCondition = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.addCondition(req.body.condition);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Condition added successfully",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: result,
    })
  );
});

const removeCondition = catchAsync(async (req, res) => {
  if (req.user.type !== "admin") throw new Error("Unauthorized");
  const result = await generalsService.removeCondition(req.params.index);
  res.status(httpStatus.OK).json(
    response({
      message: "Condition removed successfully",
      status: "OK",
      statusCode: httpStatus.OK,
      data: result,
    })
  );
});

module.exports = {
  getCategories,
  postCategories,
  categoriesDelete,
  getCoupons,
  postCoupon,
  couponDelete,
  getGeneral,
  updateGeneral,
  addCondition,
  removeCondition,
  getShippingTaxEtc,
};
