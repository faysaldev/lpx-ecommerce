const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { bankDetailsService } = require("../services");

const myBankDetails = catchAsync(async (req, res) => {
  const bankDetails = await bankDetailsService.myBankDetails(req.user.id);
  res.status(httpStatus.OK).json(
    response({
      message: "All the Bank Details",
      status: "OK",
      statusCode: httpStatus.OK,
      data: bankDetails,
    })
  );
});

const createBankDetails = catchAsync(async (req, res) => {
  const bankDetails = await bankDetailsService.createBankDetails({
    seller: req.user.id,
    ...req.body,
    phoneNumber: req.user.phoneNumber,
  });
  res.status(httpStatus.CREATED).json(
    response({
      message: "Created Bank Details",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: bankDetails,
    })
  );
});

const getBankDetailSingle = catchAsync(async (req, res) => {
  const bankDetail = await bankDetailsService.getBankDetailSingle(
    req.params.id
  );
  res.status(httpStatus.OK).json(
    response({
      message: "Bank Details",
      status: "OK",
      statusCode: httpStatus.OK,
      data: bankDetail,
    })
  );
});

const removeBankDetail = catchAsync(async (req, res) => {
  await bankDetailsService.removeBankDetail(req.params.id);
  res.status(httpStatus.NO_CONTENT).json(
    response({
      message: "Bank Detail Removed",
      status: "OK",
      statusCode: httpStatus.NO_CONTENT,
    })
  );
});

module.exports = {
  myBankDetails,
  createBankDetails,
  getBankDetailSingle,
  removeBankDetail,
};
