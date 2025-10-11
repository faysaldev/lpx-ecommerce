const httpStatus = require("http-status");
const { PaymentRequest, Vendor } = require("../models");
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

  // Return the paginated and decrypted payment requests
  return {
    paymentRequests: decryptedPaymentRequests,
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
  // Fetch the payment request without .lean() so Mongoose methods are available
  const paymentRequest = await PaymentRequest.findById(
    paymentDetailsId
  ).populate("seller", "name image email"); // Populate seller details: name, image, email

  // If payment request not found, throw an error
  if (!paymentRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Request not found");
  }

  // Decrypt bank details using the model method
  const decryptedDetails = paymentRequest.decryptBankDetails();

  // Return payment request with decrypted bank details and seller info
  return {
    paymentRequestId: paymentRequest._id,
    seller: {
      name: paymentRequest.seller.name,
      image: paymentRequest.seller.image,
      email: paymentRequest.seller.email,
    },
    bankName: decryptedDetails.bankName, // Decrypted bankName
    accountNumber: decryptedDetails.accountNumber, // Decrypted accountNumber
    accountType: paymentRequest.accountType,
    phoneNumber: paymentRequest.phoneNumber,
    withdrawalAmount: paymentRequest.withdrawalAmount,
    requestDate: paymentRequest.requestDate,
    status: paymentRequest.status,
    invoiceImage: paymentRequest.invoiceImage,
    paidDate: paymentRequest.paidDate,
  };
};
const getpaymentRequestSummery = async (userId) => {
  // Step 1: Get the vendor details for available withdrawable amount
  const withdrawalStats = await getWithDrawlPaymentlStats(userId);

  if (!withdrawalStats) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Vendor not found or no withdrawal data."
    );
  }

  // Step 2: Aggregate payment request details
  const paymentSummary = await PaymentRequest.aggregate([
    { $match: { seller: userId } }, // Filter by vendor
    {
      $group: {
        _id: null, // Grouping by null to get a single summary
        totalRequests: { $sum: 1 }, // Count total requests
        netAmount: { $sum: "$withdrawalAmount" }, // Sum of all withdrawal amounts
        averageRequestAmount: { $avg: "$withdrawalAmount" }, // Average withdrawal amount
      },
    },
  ]);

  // If no payment requests are found, return default data
  const summary =
    paymentSummary.length > 0
      ? paymentSummary[0]
      : {
          totalRequests: 0,
          netAmount: 0,
          averageRequestAmount: 0,
        };

  // Step 3: Return the summary and available withdrawal amount
  return {
    totalRequests: summary.totalRequests,
    netAmount: summary.netAmount,
    averageRequestAmount: summary.averageRequestAmount.toFixed(2), // Round to 2 decimal places
    availableToRequest: withdrawalStats.availableWithdrawl, // Available withdrawal from vendor
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
