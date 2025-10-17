const httpStatus = require("http-status");
const { Rating, Vendor } = require("../models");
const ApiError = require("../utils/ApiError");

const getMyratings = async (Id, ratingType) => {
  // Ensure the ratingType is valid
  if (!["vendor", "product"].includes(ratingType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid rating type");
  }

  // Fetch the ratings with populated author details (name, image, and user id)
  const ratings = await Rating.find({
    ratingType: ratingType,
    referenceId: Id,
  })
    .populate("author", "name image _id") // Populating the user's name, image, and _id
    .lean(); // Use lean() to return plain JavaScript objects instead of Mongoose documents

  return ratings;
};

const addNewRatings = async (ratingBody) => {
  console.log(ratingBody);

  // Ensure that the ratingBody is valid
  if (!ratingBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not authenticated");
  }

  // Add the new rating to the database
  const newRating = await Rating.create(ratingBody);

  // If the rating type is for a vendor, calculate and update the average rating
  if (ratingBody.ratingType === "vendor") {
    const vendorId = ratingBody.referenceId;

    // Retrieve the vendor's current ratings
    const vendor = await Vendor.findById(vendorId).populate("ratings");

    if (!vendor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
    }

    // Calculate the total sum of ratings
    const totalRatings = vendor.ratings.length;
    const totalRatingValue = vendor.ratings.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );

    // Include the new rating in the calculation
    const updatedTotalRatingValue = totalRatingValue + ratingBody.rating;
    const updatedTotalRatings = totalRatings + 1;

    // Calculate the new average rating
    const newAverageRating = updatedTotalRatingValue / updatedTotalRatings;

    // Update the vendor's average rating and ratings count
    vendor.averageRating = newAverageRating;
    vendor.productsCount = updatedTotalRatings; // Update the product count or rating count if necessary

    // Save the updated vendor data
    await vendor.save();
  }

  return "Rating Added Successfully";
};

const removeRatings = async (ratingId) => {
  if (!ratingId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Rating.findByIdAndDelete(ratingId);
};

const updateRatings = async (ratingData) => {
  if (!ratingData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  console.log(ratingData);

  return Rating.findByIdAndUpdate(
    ratingData?.id,
    {
      rating: ratingData.rating,
      review: ratingData.review,
    },
    { new: true }
  );
};

module.exports = {
  getMyratings,
  addNewRatings,
  removeRatings,
  updateRatings,
};
