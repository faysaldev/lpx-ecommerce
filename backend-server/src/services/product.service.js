const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const Product = require("../models/product.model");
const { Vendor } = require("../models");

const getMyProducts = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.find({ seller: userId });
};

const getAllProducts = async () => {
  return Product.find();
};

const addNewProducts = async (productsBody) => {
  if (!productsBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  // 1️⃣ Find the vendor based on authorId (seller)
  const vendor = await Vendor.findOne({ seller: productsBody.authorId });

  if (!vendor) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Vendor not found for this author"
    );
  }

  // 2️⃣ Create the product with vendor._id
  const product = await Product.create({
    ...productsBody,
    vendor: vendor._id,
  });

  // 3️⃣ (Optional) Increment vendor’s product count
  vendor.productsCount += 1;
  await vendor.save();

  return product;
};

// const addNewProducts = async (productsBody) => {
//   if (!productsBody) {
//     throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
//   }
//   const vendorId = Vendor.findOne({ seller: productsBody?.authorId });
//   console.log(vendorId);
//   return Product.create({ ...productsBody, vendor: vendorId?._id });
// };

const productDetails = async (productsId) => {
  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Product ID is required");
  }

  // Fetch the product with populated vendor details
  const product = await Product.findById(productsId)
    .populate({
      path: "vendor", // Populate the vendor details
      select:
        "storeName storePhoto averageRating verified contactEmail phoneNumber storePolicies", // Select vendor details
    })
    .lean(); // Use lean to return plain JavaScript objects instead of Mongoose documents

  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Return the populated product details
  return product;
};

const editeProducts = async (productsId, productsData) => {
  console.log(productsId, productsData);

  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Use findByIdAndUpdate to update the product based on its ID
  return Product.findByIdAndUpdate(productsId, productsData, { new: true });
  // The `{ new: true }` option ensures the returned document is the updated one.
};

const deleteProducts = async (productsId) => {
  if (!productsId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Product.findByIdAndDelete(productsId);
};

const searchProducts = async ({
  query,
  minPrice,
  maxPrice,
  condition,
  sortBy,
  page,
  limit,
  category, // added category parameter
}) => {
  // Construct the search query object
  const searchQuery = {};

  // Handle multiple query filters (name, tags, category, etc.)
  if (query) {
    const queryRegEx = { $regex: query, $options: "i" }; // Case-insensitive regex search

    searchQuery.$or = [
      { productName: queryRegEx }, // Check productName
      { category: queryRegEx }, // Check category
      { tags: { $in: query.split(",") } }, // Check tags
    ];
  }

  // Category filter
  if (category) {
    const categoryRegEx = { $regex: category, $options: "i" }; // Case-insensitive regex for category
    searchQuery.category = categoryRegEx; // Add category filter to search query
  }

  // Price range filter
  if (minPrice) searchQuery.price = { ...searchQuery.price, $gte: minPrice };
  if (maxPrice) searchQuery.price = { ...searchQuery.price, $lte: maxPrice };

  // Condition filter
  if (condition) searchQuery.condition = condition;

  // Determine sort option
  let sort = {};
  switch (sortBy) {
    case "lowToHigh":
      sort.price = 1;
      break;
    case "highToLow":
      sort.price = -1;
      break;
    case "A-Z":
      sort.productName = 1;
      break;
    case "a-z":
      sort.productName = -1;
      break;
    case "newestFirst":
    default:
      sort.createdAt = -1;
  }

  // Pagination logic
  const skip = (page - 1) * limit;

  // Query the database with the built query object and populate vendor details
  const products = await Product.find(searchQuery)
    .populate("vendor", "storeName") // Populate the vendor's store name
    .select(
      "productName category price stockQuantity condition images tags optionalPrice discountPercentage"
    ) // Select specific fields
    .skip(skip) // Pagination: skip to the appropriate page
    .limit(Number(limit)) // Limit the number of results
    .sort(sort) // Sorting based on user input
    .lean(); // Return plain JavaScript objects

  // If no products are found, return a message
  if (products.length === 0) {
    return [];
  }

  return products;
};

// const searchProducts = async ({
//   query,
//   minPrice,
//   maxPrice,
//   condition,
//   sortBy,
//   page,
//   limit,
//   category,
// }) => {
//   // Construct the search query object
//   const searchQuery = {};

//   // Handle multiple query filters (name, tags, category, etc.)
//   if (query) {
//     const queryRegEx = { $regex: query, $options: "i" }; // Case-insensitive regex search

//     searchQuery.$or = [
//       { productName: queryRegEx }, // Check productName
//       { category: queryRegEx }, // Check category
//       { tags: { $in: query.split(",") } }, // Check tags
//     ];
//   }

//   // Price range filter
//   if (minPrice) searchQuery.price = { ...searchQuery.price, $gte: minPrice };
//   if (maxPrice) searchQuery.price = { ...searchQuery.price, $lte: maxPrice };

//   // Condition filter
//   if (condition) searchQuery.condition = condition;

//   // Determine sort option
//   let sort = {};
//   switch (sortBy) {
//     case "lowToHigh":
//       sort.price = 1;
//       break;
//     case "highToLow":
//       sort.price = -1;
//       break;
//     case "A-Z":
//       sort.productName = 1;
//       break;
//     case "a-z":
//       sort.productName = -1;
//       break;
//     case "newestFirst":
//     default:
//       sort.createdAt = -1;
//   }

//   // Pagination logic
//   const skip = (page - 1) * limit;

//   // Query the database with the built query object and populate vendor details
//   const products = await Product.find(searchQuery)
//     .populate("vendor", "storeName") // Populate the vendor's store name
//     .select(
//       "productName category description price stockQuantity condition images tags"
//     ) // Select specific fields
//     .skip(skip) // Pagination: skip to the appropriate page
//     .limit(Number(limit)) // Limit the number of results
//     .sort(sort) // Sorting based on user input
//     .lean(); // Return plain JavaScript objects

//   // If no products are found, throw an error
//   if (products.length === 0) {
//     return "No products found with the given filters.";
//   }

//   return products;
// };

module.exports = {
  getMyProducts,
  addNewProducts,
  productDetails,
  editeProducts,
  deleteProducts,
  getAllProducts,
  searchProducts,
};
