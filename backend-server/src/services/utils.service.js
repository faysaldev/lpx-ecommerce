const httpStatus = require("http-status");
const { User, Product, Order, Rating } = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");

// Get Featured Products based on ratings, sales, and orders
const getFeturedProducts = async () => {
  // Fetch products sorted by rating and total sales (number of orders)
  const featuredProducts = await Product.aggregate([
    {
      $lookup: {
        from: "ratings",
        localField: "_id",
        foreignField: "referenceId",
        as: "ratings",
      },
    },
    {
      $lookup: {
        from: "orders",
        localField: "_id",
        foreignField: "totalItems.productId",
        as: "orders",
      },
    },
    {
      $project: {
        productName: 1,
        price: 1,
        stockQuantity: 1,
        condition: 1,
        images: 1,
        category: 1,
        vendor: 1,
        rating: { $avg: "$ratings.rating" }, // Average rating
        totalOrders: { $size: "$orders" }, // Total number of orders
      },
    },
    { $sort: { rating: -1, totalOrders: -1 } }, // Sort by rating and orders
    { $limit: 6 }, // Fetch top 6 products
  ]);

  // If there are fewer than 4 featured products, add new products
  if (featuredProducts.length < 4) {
    const remainingProducts = await Product.find({})
      .skip(0) // You can adjust this based on your logic
      .limit(4 - featuredProducts.length)
      .select(
        "productName price stockQuantity condition images category vendor"
      )
      .lean();

    // Add the remaining products to the featured products list
    return [...featuredProducts, ...remainingProducts];
  }

  return featuredProducts;
};

const getLpsStatistics = async () => {
  // Monthly Volume (Total amount of orders delivered in the current month)
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();

  const monthlyVolumeResult = await Order.aggregate([
    {
      $match: {
        status: "delivered",
        createdAt: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    { $group: { _id: null, totalVolume: { $sum: "$totalAmount" } } },
  ]);

  const monthlyVolume =
    monthlyVolumeResult.length > 0 ? monthlyVolumeResult[0].totalVolume : 0;

  // Listed Items (Total number of products in the database)
  const listedItems = await Product.countDocuments();

  // Active Users (Users who made at least one purchase in the last 30 days)
  const activeUsers = await User.countDocuments({
    _id: {
      $in: await Order.distinct("customer", {
        createdAt: { $gte: moment().subtract(30, "days").toDate() },
      }),
    },
  });

  // Satisfaction (Average rating of all products)
  const ratingsResult = await Rating.aggregate([
    { $match: { ratingType: "product" } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const satisfaction =
    ratingsResult.length > 0 ? ratingsResult[0].averageRating : 0;

  return {
    monthlyVolume: `$${monthlyVolume.toLocaleString()}`,
    listedItems: `${listedItems.toLocaleString()}`,
    activeUsers: `${activeUsers.toLocaleString()}`,
    satisfaction: `${satisfaction.toFixed(1)}%`,
  };
};

module.exports = {
  getFeturedProducts,
  getLpsStatistics,
};
