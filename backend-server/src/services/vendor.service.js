const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Vendor = require("../models/vendor.model");
const Rating = require("../models/rating.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const { General } = require("../models");

const searchSingleOwnerShop = async ({
  vendorId,
  query = "",
  category = "",
  sortBy = "createdAt",
  page = 1,
  limit = 10,
}) => {
  const skip = (page - 1) * limit;

  // Build the search query for products
  const searchQuery = {
    vendor: vendorId,
    ...(query && { productName: { $regex: query, $options: "i" } }),
    ...(category && { category: { $regex: category, $options: "i" } }),
  };

  // Sorting
  let sortOrder = {};
  switch (sortBy) {
    case "newest":
      sortOrder = { createdAt: -1 }; // Newest first
      break;
    case "lowToHigh":
      sortOrder = { price: 1 }; // Low to high price
      break;
    case "highToLow":
      sortOrder = { price: -1 }; // High to low price
      break;
    case "mostPopular":
      sortOrder = { averageRating: -1 }; // Based on ratings
      break;
    default:
      sortOrder = { createdAt: -1 }; // Default: Newest first
  }

  // Fetch filtered and sorted products
  const products = await Product.find(searchQuery)
    .populate("vendor", "storeName")
    .select(
      "productName category price stockQuantity condition images vendor averageRating tags optionalPrice discountPercentage"
    )
    .skip(skip)
    .limit(limit)
    .sort(sortOrder)
    .lean();

  // Get the total number of products for pagination
  const totalProducts = await Product.countDocuments(searchQuery);

  const totalPages = Math.ceil(totalProducts / limit);

  // Map the products to the desired format
  const formattedProducts = products.map((product) => ({
    _id: product._id.toString(),
    vendor: {
      _id: product.vendor._id.toString(),
      storeName: product.vendor.storeName,
    },
    productName: product.productName,
    category: product.category,
    condition: product.condition,
    tags: product.tags || [], // Ensure tags are an array (can be empty if not defined)
    price: product.price,
    optionalPrice: product.optionalPrice,
    stockQuantity: product.stockQuantity,
    images: product.images,
    discountPercentage: product.discountPercentage,
    vendorId: product.vendor._id.toString(), // Include vendorId as string
  }));

  return {
    products: formattedProducts,
    currentPage: page,
    totalPages,
    totalProducts,
  };
};

const getSingleVendors = async (vendorId) => {
  if (!vendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Vendor ID is required");
  }

  // Fetch the vendor
  const vendor = await Vendor.findById(vendorId).lean();
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  // Calculate average rating from the Rating collection
  const ratingAggregation = await Rating.aggregate([
    { $match: { ratingType: "vendor", referenceId: vendor._id } },
    {
      $group: {
        _id: "$referenceId",
        averageRating: { $avg: "$rating" },
        totalRatings: { $sum: 1 },
      },
    },
  ]);

  const avgRating = ratingAggregation[0]?.averageRating || 0;
  const totalRatings = ratingAggregation[0]?.totalRatings || 0;

  // Add average rating to the vendor object
  return {
    ...vendor,
    averageRating: avgRating,
    totalRatings: totalRatings,
  };
};

// TODO: searching vendor

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
    case "oldest":
      sortOrder = { createdAt: 1 }; // Oldest first
      break;
    case "topVendor":
      sortOrder = { totalEarnings: -1 }; // Top vendors by earnings (High to Low)
      break;
    case "by-ratings":
      sortOrder = { averageRating: -1 }; // Sort by average rating (high to low)
      break;
    case "by-products-count":
      sortOrder = { productsCount: -1 }; // Sort by product count (high to low)
      break;
    default:
      sortOrder = { createdAt: -1 }; // Default: Newest first
  }

  try {
    const vendors = await Vendor.aggregate([
      { $match: searchQuery }, // Matching vendors by the search query

      // Step 1: Add product count dynamically
      {
        $lookup: {
          from: "products", // Lookup products for each vendor
          localField: "_id",
          foreignField: "vendor",
          as: "products",
        },
      },
      {
        $addFields: {
          productsCount: { $size: "$products" }, // Add product count field
        },
      },

      // Step 2: Add ratings and calculate average rating
      {
        $lookup: {
          from: "ratings",
          localField: "_id",
          foreignField: "referenceId",
          as: "ratings",
        },
      },
      {
        $addFields: {
          averageRating: { $avg: "$ratings.rating" }, // Add average rating field
        },
      },

      // Step 3: Sorting based on the sortBy parameter
      { $sort: sortOrder },

      // Step 4: Pagination
      { $skip: (page - 1) * limit }, // Skip based on the page
      { $limit: limit }, // Limit the number of results

      // Step 5: Select the required fields
      {
        $project: {
          _id: 1,
          seller: 1,
          ownerName: 1,
          storeName: 1,
          storePhoto: 1,
          description: 1,
          category: 1,
          experiences: 1,
          averageRating: 1,
          status: 1,
          location: 1,
          productsCount: 1,
          totalEarnings: 1, // Make sure to return totalEarnings to support 'topVendor' sort
        },
      },
    ]);

    // Get the total number of vendors for pagination
    const totalVendors = await Vendor.countDocuments(searchQuery);

    // Return data with pagination info
    const totalPages = Math.ceil(totalVendors / limit);
    return {
      vendors,
      currentPage: page,
      totalPages,
      totalVendors,
    };
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return { vendors: [], currentPage: 1, totalPages: 0, totalVendors: 0 };
  }
};

const getVendors = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Vendor.find({ seller: userId }).select("_id storeName seller");
};

const createVendorRequest = async (vendorBody) => {
  if (!vendorBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  // Check if the user already has a vendor with a status of "pending" or "approved"
  const existingVendor = await Vendor.findOne({
    seller: vendorBody.seller,
    $or: [{ status: "pending" }, { status: "approved" }],
  });

  // If an existing vendor is found, throw an error
  if (existingVendor) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You already have a vendor request"
    );
  }

  // If no existing vendor found, create a new vendor
  const createNewVendor = await Vendor.create(vendorBody);
  return createNewVendor;
};

const approvedVendorRequest = async (VendorId, sellerId) => {
  if (!VendorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  const approved = await Vendor.findByIdAndUpdate(
    VendorId,
    {
      status: "approved",
      verified: true,
    },
    { new: true }
  );
  return approved;
};

const getVendorByUserId = async (id) => {
  return Vendor.findOne({ seller: id }).select("_id");
};

// venorder ordercomplete money added
const updateVendorMoneyCalculation = async (id, data) => {
  // TODO: taking 5 parcentage from the vendor payment
  const general = await General.findOne();
  const platformCharge = general ? general : [];
  const percentage = 5;
  const remainingAmount = data.totalEarnings * (1 - percentage / 100);

  // Find the vendor by ID
  const vendor = await Vendor.findById(id);

  // If vendor doesn't exist, throw an error
  if (!vendor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }
  // Add the new earnings to the previous totalEarnings
  const updatedEarnings = vendor.totalEarnings + remainingAmount;
  const updatedAvailableWithDrawl = vendor.availableWithdrawl + remainingAmount;
  // Update the vendor's totalEarnings with the new value
  return Vendor.findByIdAndUpdate(
    id,
    {
      totalEarnings: updatedEarnings,
      availableWithdrawl: updatedAvailableWithDrawl,
    },
    { new: true }
  );
};

module.exports = {
  getVendorByUserId,
  getVendors,
  createVendorRequest,
  approvedVendorRequest,
  allVendors,
  getSingleVendors,
  searchSingleOwnerShop,
  updateVendorMoneyCalculation,
};
