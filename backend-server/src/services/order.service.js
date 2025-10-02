const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");
const { decryptData } = require("../utils/decrypteHealper");

const myOrders = async (
  userId,
  { status, sortBy = "newestFirst", page = 1, limit = 10 }
) => {
  // Pagination setup
  const skip = (page - 1) * limit;

  // Building the query filter based on status
  const searchQuery = { customer: userId };

  if (status) {
    searchQuery.status = status; // Filter by status if provided
  }

  // Sorting logic
  let sortOrder = {};
  switch (sortBy) {
    case "newestFirst":
      sortOrder = { createdAt: -1 }; // Newest first
      break;
    case "oldestFirst":
      sortOrder = { createdAt: 1 }; // Oldest first
      break;
    case "highToLow":
      sortOrder = { totalAmount: -1 }; // Highest price first
      break;
    case "lowToHigh":
      sortOrder = { totalAmount: 1 }; // Lowest price first
      break;
    default:
      sortOrder = { createdAt: -1 }; // Default to newest first
  }

  try {
    // Fetching orders with pagination, filtering, and sorting
    const orders = await Order.find(searchQuery)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOrder)
      .lean(); // Use lean() to return plain JavaScript objects instead of Mongoose documents

    // Get total count of orders for pagination
    const totalOrders = await Order.countDocuments(searchQuery);

    // Calculate total pages for pagination
    const totalPages = Math.ceil(totalOrders / limit);

    return {
      orders,
      currentPage: page,
      totalPages,
      totalOrders,
    };
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Error fetching orders"
    );
  }
};

const createOrder = async (data) => {
  if (!data) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User Is not Authenticate");
  }
  return Order.create(data);
};

const getOrderSingleDetails = async (orderId) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await Order.findById(orderId).populate({
    path: "paymentCardId",
    select: "cardHolderName cardNumber",
  });

  if (!order) {
    throw [];
  }

  // Decrypt the card number
  const decryptedCardNumber = decryptData(order?.paymentCardId?.cardNumber);

  return {
    ...order.toObject(),
    paymentCardId: {
      ...order.paymentCardId.toObject(),
      cardNumber: decryptedCardNumber,
    },
  };
};

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
};
