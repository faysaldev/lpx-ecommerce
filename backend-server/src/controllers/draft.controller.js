const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const response = require("../config/response");
const { draftService } = require("../services");

const getMyDrafts = catchAsync(async (req, res) => {
  const drafts = await draftService.getMyDrafts(req.user.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "All the Drafts",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: drafts,
    })
  );
});

const addNewDrafts = catchAsync(async (req, res) => {
  const imagePaths = req?.files?.image?.map((img) => `${img.path}`);

  const dataFormat = {
    images: imagePaths,
    ...req.body,
    shipping: {
      shippingCost: req.body.shippingCost,
      weight: req.body.weight,
      dimensions: req.body.dimensions,
    },
    authorId: req.user.id,
  };

  const drafts = await draftService.addNewDrafts(dataFormat);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Added Drafts",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: drafts,
    })
  );
});

const DraftDetails = catchAsync(async (req, res) => {
  const drafts = await draftService.DraftDetails(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Single drafts",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: drafts,
    })
  );
});

const deleteDrafts = catchAsync(async (req, res) => {
  const drafts = await draftService.deleteDrafts(req.params.id);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Deleted drafts",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: drafts,
    })
  );
});

const editeDraft = catchAsync(async (req, res) => {
  const drafts = await draftService.editeDraft(req.params.id, req.body);
  res.status(httpStatus.CREATED).json(
    response({
      message: "Edited drafts",
      status: "OK",
      statusCode: httpStatus.CREATED,
      data: drafts,
    })
  );
});

module.exports = {
  getMyDrafts,
  editeDraft,
  deleteDrafts,
  DraftDetails,
  addNewDrafts,
};
