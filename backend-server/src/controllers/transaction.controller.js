const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { transactionService } = require("../services");

const myTransaction = catchAsync(async (req, res) => {
  const myTransac = await transactionService.myTransaction(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Vendors",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: myTransac,
    })
  );
});

module.exports = {
  myTransaction,
};
