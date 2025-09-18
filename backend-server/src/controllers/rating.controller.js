const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { ratingService } = require("../services");

const getMyratings = catchAsync(async (req, res) => {
  const myratings = await ratingService.getMyratings(req.user.id);
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
};
