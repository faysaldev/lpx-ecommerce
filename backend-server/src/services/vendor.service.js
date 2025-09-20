const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Vendor = require("../models/vendor.model");

const allVendors = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
}) => {
  page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  limit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

  const searchQuery = search
    ? {
        $or: [
          { storeName: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const sortOrder =
    sortBy === "createdAt" ? { createdAt: -1 } : { createdAt: 1 };

  try {
    const vendors = await Vendor.find(searchQuery)
      .sort(sortOrder)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalVendors = await Vendor.countDocuments(searchQuery);

    const totalPages = Math.ceil(totalVendors / limit);

    return {
      vendors,
      currentPage: page,
      totalPages,
      totalVendors,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching vendors"
    );
  }
};

module.exports = { allVendors };

const getVendors = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Vendor.find({ seller: userId });
};

const createVendorRequest = async (vendorBody) => {
  if (!vendorBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  const createNewVendor = await Vendor.create(vendorBody);
  return createNewVendor;
};

const approvedVendorRequest = async (VendorId) => {
  if (!VendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  const approved = await Vendor.findByIdAndUpdate(VendorId, {
    status: "approved",
  });
  return approved;
};

module.exports = {
  getVendors,
  createVendorRequest,
  approvedVendorRequest,
  allVendors,
};
