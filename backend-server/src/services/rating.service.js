const httpStatus = require("http-status");
const { Rating } = require("../models");
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
  if (!ratingBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Rating.create(ratingBody);
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
