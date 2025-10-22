const httpStatus = require("http-status");
const { PaymentRequest, Vendor, BankDetails } = require("../models");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto-js");
const { decryptData } = require("../utils/decrypteHealper"); // Assuming decryptData is imported from the helper
const { default: mongoose } = require("mongoose");

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
  if (status && status !== "all") {
    filter.status = status;
  }

  // Apply search filter if a search string is provided
  const searchFilter = search
    ? {
        $or: [
          { invoiceImage: { $regex: search, $options: "i" } },
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
    sortOption = { createdAt: -1 }; // Sort by latest (createdAt descending)
  } else if (sort === "lowToHigh") {
    sortOption = { withdrawalAmount: 1 }; // Sort by low to high withdrawalAmount
  } else if (sort === "highToLow") {
    sortOption = { withdrawalAmount: -1 }; // Sort by high to low withdrawalAmount
  }

  // Pagination logic
  const skip = (page - 1) * limit;

  // Fetch the payment requests with filters, pagination, and sorting
  const paymentRequests = await PaymentRequest.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOption)
    .populate("bankDetails"); // Ensure bankDetails are populated

  // Decrypt bankName, accountNumber, and phoneNumber for each payment request
  const decryptedPaymentRequests = await Promise.all(
    paymentRequests.map(async (request) => {
      // Ensure bankDetails are populated
      if (request.bankDetails) {
        // Decrypt the bank details using the decryptData method
        const decryptedBankName = decryptData(request.bankDetails.bankName);
        const decryptedIBAN = decryptData(request.bankDetails.IBAN);
        const decryptedPhoneNumber = decryptData(
          request.bankDetails.phoneNumber
        );

        // Replace bankDetails with decrypted data
        return {
          ...request.toObject(), // Convert mongoose document to plain object
          bankDetails: {
            bankName: decryptedBankName,
            IBAN: decryptedIBAN,
            phoneNumber: decryptedPhoneNumber,
          },
        };
      }

      // If no bankDetails, return the request as is
      return request.toObject();
    })
  );

  // Count the total number of records (for pagination)
  const totalCount = await PaymentRequest.countDocuments(query);

  // Return the paginated and decrypted payment requests
  return {
    paymentRequests: decryptedPaymentRequests,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
};

const createNewPaymentRequest = async (paymentBody) => {
  const paymentRequest = await PaymentRequest.create(paymentBody);
  return paymentRequest;
};

const updatePaymentRequestStatus = async (id, paymentBody) => {
  return PaymentRequest.findByIdAndUpdate(id, paymentBody, { new: true });
};

const getEligleWithDrawl = async (userId) => {
  // Get vendor details
  const vendor = await Vendor.findOne({ seller: userId }).select(
    "availableWithdrawl totalEarnings totalWithDrawal"
  );
  if (!vendor) {
    return httpStatus.NOT_FOUND, "Vendor not found";
  }

  return vendor;
};

const getWithDrawlPaymentlStats = async (userId) => {
  // Get vendor details
  const vendor = await Vendor.findOne({ seller: userId }).select(
    "availableWithdrawl"
  );
  if (!vendor) {
    return httpStatus.NOT_FOUND, "Vendor not found";
  }

  // Total number of withdrawal requests
  const totalRequests = await PaymentRequest.countDocuments({
    seller: userId,
  });

  // Total number of pending requests
  const pendingRequests = await PaymentRequest.countDocuments({
    seller: userId,
    status: "pending",
  });

  // Total number of approved requests
  const approvedRequests = await PaymentRequest.countDocuments({
    seller: userId,
    status: "paid",
  });

  // Return the stats
  return {
    availableWithdrawl: vendor.availableWithdrawl,
    totalRequests,
    pendingRequests,
    approvedRequests,
  };
};

const getSinglePaymentRequestDetails = async (paymentDetailsId) => {
  // Fetch the payment request and populate the necessary fields
  const paymentRequest = await PaymentRequest.findById(paymentDetailsId)
    .populate("bankDetails") // Populate bankDetails
    .populate("seller", "name image email"); // Populate seller details: name, image, email

  // If payment request not found, throw an error
  if (!paymentRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Request not found");
  }

  // Ensure that bankDetails are populated and decrypt the fields
  const decryptedDetails = paymentRequest.bankDetails
    ? paymentRequest.bankDetails.decryptBankDetails() // Decrypt bank details
    : {};

  // Return payment request with decrypted bank details and seller info
  return {
    paymentRequestId: paymentRequest._id,
    createdAt: paymentRequest.createdAt,
    paidDate: paymentRequest.paidDate,
    seller: {
      name: paymentRequest.seller.name,
      image: paymentRequest.seller.image,
      email: paymentRequest.seller.email,
    },
    bankDetails: {
      bankName: decryptedDetails.bankName, // Decrypted bankName
      accountNumber: decryptedDetails.accountNumber, // Decrypted accountNumber
      phoneNumber: decryptedDetails.phoneNumber, // Decrypted phoneNumber
      accountType: paymentRequest.bankDetails.accountType, // accountType from populated bankDetails
    },
    withdrawalAmount: paymentRequest.withdrawalAmount,
    requestDate: paymentRequest.requestDate,
    status: paymentRequest.status,
    invoiceImage: paymentRequest.invoiceImage,
    paidDate: paymentRequest.paidDate,
  };
};

const getpaymentRequestSummery = async (userId) => {
  // Get withdrawal stats (assuming this is already implemented)
  const withdrawalStats = await getWithDrawlPaymentlStats(userId);

  if (!withdrawalStats) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Vendor not found or no withdrawal data."
    );
  }

  // Aggregating payment request data for the seller
  const paymentSummary = await PaymentRequest.aggregate([
    { $match: { seller: userId } }, // Correctly casting userId to ObjectId
    {
      $group: {
        _id: null, // No need to group by any field, just aggregate
        totalRequests: { $sum: 1 }, // Total requests made by the seller
        netAmount: { $sum: "$withdrawalAmount" }, // Total withdrawal amount
        averageRequestAmount: { $avg: "$withdrawalAmount" }, // Average amount requested
      },
    },
  ]);

  // If no payment request found, return a default summary
  const summary =
    paymentSummary.length > 0
      ? paymentSummary[0]
      : {
          totalRequests: 0,
          netAmount: 0,
          averageRequestAmount: 0,
        };

  // Return the summary, including available withdrawal amount from withdrawalStats
  return {
    totalRequests: summary.totalRequests,
    netAmount: summary.netAmount,
    averageRequestAmount: summary.averageRequestAmount.toFixed(2), // Format average to two decimal places
    availableToRequest: withdrawalStats.availableWithdrawl, // Assuming this is returned from getWithDrawlPaymentlStats
  };
};

module.exports = {
  getpaymentRequest,
  createNewPaymentRequest,
  updatePaymentRequestStatus,
  getEligleWithDrawl,
  getWithDrawlPaymentlStats,
  getSinglePaymentRequestDetails,
  getpaymentRequestSummery,
};
