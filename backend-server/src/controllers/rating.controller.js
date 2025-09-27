const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { ratingService } = require("../services");

const getMyratings = catchAsync(async (req, res) => {
  const myratings = await ratingService.getMyratings(
    req.user.id,
    req.params.type
  );
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the ratings",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myratings,
    })
  );
});

const addNewRatings = catchAsync(async (req, res) => {
  const myratings = await ratingService.addNewRatings({
    ...req.body,
    author: req.user.id,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Rating Created",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myratings,
    })
  );
});

const removeRatings = catchAsync(async (req, res) => {
  const myratings = await ratingService.removeRatings(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Rating Removed",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myratings,
    })
  );
});

const updateRatings = catchAsync(async (req, res) => {
  const myratings = await ratingService.updateRatings({
    id: req.params.id,
    ...req.body,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the ratings",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myratings,
    })
  );
});

module.exports = {
  getMyratings,
  addNewRatings,
  updateRatings,
  removeRatings,
};
