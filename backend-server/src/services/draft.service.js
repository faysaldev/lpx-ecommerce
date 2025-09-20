const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const DraftProduct = require("../models/draft.modal");

const getMyDrafts = async (userId) => {
  if (!userId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return DraftProduct.find({ seller: userId, isDraft: true });
};

const addNewDrafts = async (draftBody) => {
  if (!draftBody) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return DraftProduct.create(draftBody);
};

const DraftDetails = async (draftId) => {
  if (!draftId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return DraftProduct.findById(draftId);
};

const editeDraft = async (draftId, draftsData) => {
  console.log(draftId, draftsData);

  if (!draftId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }

  // Use findByIdAndUpdate to update the DraftProduct based on its ID
  return DraftProduct.findByIdAndUpdate(draftId, draftsData, { new: true });
  // The `{ new: true }` option ensures the returned document is the updated one.
};

const deleteDrafts = async (draftId) => {
  if (!draftId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return DraftProduct.findByIdAndDelete(draftId);
};

module.exports = {
  getMyDrafts,
  addNewDrafts,
  DraftDetails,
  editeDraft,
  deleteDrafts,
};
