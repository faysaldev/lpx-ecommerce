const httpStatus = require("http-status");
const { PaymentRequest } = require("../models");
const ApiError = require("../utils/ApiError");

const getpaymentRequest = async ({
  userId,
  page,
  limit,
  search,
  status,
  sort,
}) => {
  const filter = { seller: userId }; // Only fetch payment requests for the logged-in seller

  // Apply status filter if status is provided
  if (status !== "all") {
    filter.status = status;
  }

  // Apply search filter if a search string is provided
  const searchFilter = search
    ? {
        $or: [
          { description: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  // Combine filters
  const query = { ...filter, ...searchFilter };

  // Sorting options
  let sortOption = {};
  if (sort === "latest") {
    sortOption = { createdAt: -1 }; // Sort by latest
  } else if (sort === "lowToHigh") {
    sortOption = { amountRequested: 1 }; // Sort by low to high amountRequested
  } else if (sort === "highToLow") {
    sortOption = { amountRequested: -1 }; // Sort by high to low amountRequested
  }

  // Pagination logic
  const skip = (page - 1) * limit;
  const paymentRequests = await PaymentRequest.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption);

  // Decrypt bankName and accountNumber for each payment request
  const decryptedPaymentRequests = paymentRequests.map((request) => {
    const decryptedDetails = request.decryptBankDetails(); // Decrypt bank details
    return {
      ...request.toObject(), // Convert mongoose document to plain object
      bankName: decryptedDetails.bankName, // Add decrypted bankName
      accountNumber: decryptedDetails.accountNumber, // Add decrypted accountNumber
    };
  });

  // Count the total number of records (for pagination)
  const totalCount = await PaymentRequest.countDocuments(query);

  return {
    paymentRequests: decryptedPaymentRequests, // Return decrypted payment requests
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

const getpaymentRequestStatitics = async (userId) => {
  const res = await PaymentRequest.find({ seller: userId });
  return res;
};

const createNewPaymentRequest = async (paymentBody) => {
  return PaymentRequest.create(paymentBody);
};

const updatePaymentRequestStatus = async (id, paymentBody) => {
  return PaymentRequest.findByIdAndUpdate(id, { paymentBody });
};

module.exports = {
  getpaymentRequest,
  createNewPaymentRequest,
  updatePaymentRequestStatus,
};
