const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Vendor = require("../models/vendor.model");
const Rating = require("../models/rating.model");
const Order = require("../models/order.model");

const allVendors = async ({
  page = 1,
  limit = 10,
  search = "",
  sortBy = "createdAt",
  category = "",
  ratingFilter = "", // Rating filter added here
}) => {
  page = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
  limit = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;

  // Construct the search query
  const searchQuery = {
    status: "approved", // Only approved vendors
    ...(search && {
      $or: [
        { storeName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    }),
    ...(category && { category: { $regex: category, $options: "i" } }), // Category filter
  };

  // Rating filter: If provided, filter vendors by rating
  if (ratingFilter) {
    const ratingRange = ratingFilter.split("-");
    const minRating = parseInt(ratingRange[0]);
    const maxRating = parseInt(ratingRange[1]);
    searchQuery["averageRating"] = { $gte: minRating, $lte: maxRating }; // Filter by average rating
  }

  // Construct sort order
  let sortOrder = {};
  switch (sortBy) {
    case "newest":
      sortOrder = { createdAt: -1 }; // Newest first
      break;
    case "highToLow":
      sortOrder = { totalSales: -1 }; // High to low sales
      break;
    case "lowToHigh":
      sortOrder = { totalSales: 1 }; // Low to high sales
      break;
    case "A-Z":
      sortOrder = { storeName: 1 }; // A-Z store names
      break;
    case "Z-A":
      sortOrder = { storeName: -1 }; // Z-A store names
      break;
    default:
      sortOrder = { createdAt: -1 }; // Default: Newest first
  }

  try {
    const vendors = await Vendor.find(searchQuery)
      .skip((page - 1) * limit) // Pagination
      .limit(limit) // Limit the number of results
      .sort(sortOrder); // Sorting based on the sortBy parameter

    // Get the total number of vendors for pagination
    const totalVendors = await Vendor.countDocuments(searchQuery);

    // Add extra fields like total sales, ratings, etc.
    const vendorsWithDetails = await Promise.all(
      vendors.map(async (vendor) => {
        // Get total sales from the Order model
        const totalSales = await Order.aggregate([
          { $match: { vendorId: vendor._id, status: "completed" } },
          { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
        ]);

        // Get the average rating and number of reviews
        const vendorRatings = await Rating.aggregate([
          { $match: { referenceId: vendor._id, ratingType: "vendor" } },
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ]);

        // Add sales, average rating, and review count to the vendor object
        vendor.totalSales =
          totalSales.length > 0 ? totalSales[0].totalSales : 0;
        vendor.averageRating =
          vendorRatings.length > 0 ? vendorRatings[0].averageRating : 0;
        vendor.reviewCount =
          vendorRatings.length > 0 ? vendorRatings[0].reviewCount : 0;

        return vendor;
      })
    );

    // Return data with pagination info
    const totalPages = Math.ceil(totalVendors / limit);
    return {
      vendors: vendorsWithDetails,
      currentPage: page,
      totalPages,
      totalVendors,
    };
  } catch (error) {
    return { vendor: [], currentPage: 1, totalPages: 0, totalVendors: 0 };
  }
};

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

  console.log(vendorBody);
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
