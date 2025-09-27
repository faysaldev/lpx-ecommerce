const httpStatus = require("http-status");
const { Rating } = require("../models");
const ApiError = require("../utils/ApiError");

const getMyratings = async (authorId, ratingType) => {
  if (!ratingType || !authorId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required parameters");
  }

  if (!["vendor", "product"].includes(ratingType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid rating type");
  }

  const ratings = await Rating.find({
    ratingType: ratingType,
    author: authorId,
  });

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
