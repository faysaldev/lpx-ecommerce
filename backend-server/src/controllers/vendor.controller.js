const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { vendorService } = require("../services");

const allVendors = catchAsync(async (req, res) => {
  console.log(req.query);
  const vendors = await vendorService.allVendors(req.params);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

const getVendors = catchAsync(async (req, res) => {
  const vendors = await vendorService.getVendors(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: vendors,
    })
  );
});

const createVendorRequest = catchAsync(async (req, res) => {
  console.log(req.user);
  const createVendor = await vendorService.createVendorRequest({
    ...req.body,
    seller: req.user.id,
    ownerName: req.user.name,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Apllication Done. Wait for the admin Approval",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: createVendor,
    })
  );
});

const approvedVendorRequest = catchAsync(async (req, res) => {
  const approvedVendors = await vendorService.approvedVendorRequest(
    req.body.vendorId
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "Approval Done",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: approvedVendors,
    })
  );
});

module.exports = {
  getVendors,
  createVendorRequest,
  approvedVendorRequest,
  allVendors,
};
