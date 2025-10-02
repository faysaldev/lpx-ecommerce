const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { vendorService } = require("../services");

const allVendors = catchAsync(async (req, res) => {
  const {
    page = 1, // Default page: 1
    limit = 10, // Default limit: 10
    search = "", // Search term for store name, description
    sortBy = "createdAt", // Default sort: newest first
    category = "", // Category filter
    ratingFilter = "", // Rating filter (optional)
  } = req.query;

  const vendors = await vendorService.allVendors({
    page,
    limit,
    search,
    sortBy,
    category,
    ratingFilter,
  });
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
  if (req.file) {
    req.body.storePhoto = `/uploads/vendors/${req.file.filename}`;
  }

  console.log(req);
  const createVendor = await vendorService.createVendorRequest({
    ...req.body,
    seller: req.user.id,
    ownerName: req.user.name,
    socialLinks: JSON.parse(req?.body?.socialLinks),
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
