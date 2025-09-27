const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { productService } = require("../services");

const getMyProducts = catchAsync(async (req, res) => {
  const products = await productService.getMyProducts(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const getAllProducts = catchAsync(async (req, res) => {
  const products = await productService.getAllProducts();

  console.log(products);

  res.status(httpStatus.CREATED).json(
    response({
      message: "All the products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const addNewProducts = catchAsync(async (req, res) => {
  // console.log(req.files, req.body);
  // return;
  const imagePaths = req?.files?.image?.map((img) => `${img.path}`);
  const dataFormat = {
    images: imagePaths,
    ...req.body,
    shipping: {
      shippingCost: req.body.shippingCost,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
    },
    authorId: req.user.id,
  };

  const products = await productService.addNewProducts(dataFormat);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Added Products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const productDetails = catchAsync(async (req, res) => {
  const products = await productService.productDetails(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Single Products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const deleteProducts = catchAsync(async (req, res) => {
  const products = await productService.deleteProducts(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Deleted Products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

const editeProducts = catchAsync(async (req, res) => {
  const products = await productService.editeProducts(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Edited Products",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: products,
    })
  );
});

module.exports = {
  getMyProducts,
  addNewProducts,
  productDetails,
  deleteProducts,
  editeProducts,
  getAllProducts,
};
