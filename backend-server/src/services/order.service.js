const httpStatus = require("http-status");
const { Order } = require("../models");
const ApiError = require("../utils/ApiError");
const PDFDocument = require("pdfkit");
const fs = require("fs"); // For file system operations

const myOrders = async (
  userId,
  { status, sortBy = "newestFirst", page = 1, limit = 10 }
) => {
  const skip = (page - 1) * limit;
  const searchQuery = { customer: userId };
  searchQuery.status = { $ne: "unpaid" };

  if (status) {
    searchQuery.status = status;
  }

  let sortOrder = {};
  switch (sortBy) {
    case "newestFirst":
      sortOrder = { createdAt: -1 };
      break;
    case "oldestFirst":
      sortOrder = { createdAt: 1 };
      break;
    case "highToLow":
      sortOrder = { totalAmount: -1 };
      break;
    case "lowToHigh":
      sortOrder = { totalAmount: 1 };
      break;
    default:
      sortOrder = { createdAt: -1 };
  }

  try {
    const orders = await Order.find(searchQuery)
      .select(
        "orderID status totalAmount totalItems shippingInformation createdAt"
      )
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOrder)
      .populate("totalItems.productId", "productName images")
      .populate("totalItems.vendorId", "storeName")
      .lean();

    orders.forEach((order) => {
      order.totalItems.forEach((item) => {
        if (item.productId.images && item.productId.images.length > 0) {
          const firstImage = item.productId.images[0];
          item.productId.images[0] = `${firstImage}_modified`;
        }
      });
    });

    const totalOrders = await Order.countDocuments(searchQuery);
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

  const order = await Order.findById(orderId)
    .populate({
      path: "customer", // Populate the customer details
      select: "name email phoneNumber address image", // Select necessary fields for user details
    })
    .populate({
      path: "totalItems.productId", // Populate the product details
      select: "productName description category price images", // Select the fields you want for product details
    })
    .populate({
      path: "totalItems.vendorId", // Populate the vendor details
      select: "storeName", // Only select the store name
    });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  return order;
};

// todo: working to stripe webhook to update all the details
const editeSingleOrder = async (orderId, newData) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const updateData = {
    status: newData.status || undefined, // Only update status if it's provided
    shippingInformation: {
      firstName: newData.shippingInformation?.name?.split(" ")[0] || "",
      lastName: newData.shippingInformation?.name?.split(" ")[1] || "",
      name: newData.shippingInformation?.name,
      email: newData.shippingInformation?.email,
      phoneNumber: newData.shippingInformation?.phoneNumber,
      streetAddress: newData.shippingInformation?.address?.line1,
      apartment: newData.shippingInformation?.address?.line2,
      city: newData.shippingInformation?.address?.city,
      state: newData.shippingInformation?.address?.state,
      zipCode: newData.shippingInformation?.address?.postal_code,
      country: newData.shippingInformation?.address?.country,
      deliveryInstructions:
        newData.shippingInformation?.deliveryInstructions || "",
    },
    billingInformation: {
      firstName: newData.billingInformation?.name?.split(" ")[0] || "",
      lastName: newData.billingInformation?.name?.split(" ")[1] || "",
      name: newData.billingInformation?.name,
      email: newData.billingInformation?.email,
      phoneNumber: newData.billingInformation?.phoneNumber,
      streetAddress: newData.billingInformation?.address?.line1,
      apartment: newData.billingInformation?.address?.line2,
      city: newData.billingInformation?.address?.city,
      state: newData.billingInformation?.address?.state,
      zipCode: newData.billingInformation?.address?.postal_code,
      country: newData.billingInformation?.address?.country,
      deliveryInstructions:
        newData.billingInformation?.deliveryInstructions || "",
    },
  };

  return Order.findByIdAndUpdate(orderId, updateData, { new: true });
};

// generating pdf

const generateInvoicePDF = (order) => {
  const doc = new PDFDocument();

  // Creating PDF in memory (instead of saving to a file)
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {
    const pdfBuffer = Buffer.concat(chunks);
    return pdfBuffer;
  });

  // Add Invoice Title
  doc.fontSize(20).text("Invoice", { align: "center" });

  doc.moveDown();

  // Customer Details
  doc.fontSize(12).text(`Order ID: ${order.orderID}`);
  doc.text(`Customer Name: ${order.customer.name}`);
  doc.text(`Email: ${order.customer.email}`);
  doc.text(`Phone: ${order.customer.phoneNumber}`);

  doc.moveDown();

  // Shipping Address
  doc.text(
    `Shipping Address: ${order.shippingInformation.streetAddress}, ${order.shippingInformation.state}, ${order.shippingInformation.country}`
  );

  if (order.shippingInformation.deliveryInstructions) {
    doc.text(
      `Delivery Instructions: ${order.shippingInformation.deliveryInstructions}`
    );
  }

  doc.moveDown();

  // Order Items
  doc.text("Items Ordered:");
  order.totalItems.forEach((item) => {
    doc.text(
      `- ${item?.productId?.productName} (Qty: ${item.quantity}) - $${item.price}`
    );
  });

  doc.moveDown();

  // Order Notes and Total
  doc.text(`Order Notes: ${order.orderNotes}`);
  doc.text(`Subtotal: $${order.totalAmount}`);
  doc.text(`Shipping: $${order.shipping}`);
  doc.text(`Tax: $${order.tax}`);
  doc.text(`Total Amount: $${order.totalAmount + order.shipping + order.tax}`);

  // Finalize the PDF
  doc.end();

  return doc;
};

const getOrderSingleDetailsInvoice = async (orderId) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await Order.findById(orderId)
    .populate({
      path: "customer", // Populate the customer details
      select: "name email phoneNumber address image", // Select necessary fields for user details
    })
    .populate({
      path: "totalItems.productId", // Populate the product details
      select: "productName description category price images", // Select the fields you want for product details
    })
    .populate({
      path: "totalItems.vendorId", // Populate the vendor details
      select: "storeName", // Only select the store name
    });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  console.log(order.toObject());

  const pdfBuffer = generateInvoicePDF(order);
  return pdfBuffer;
};

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
  editeSingleOrder,
  getOrderSingleDetailsInvoice,
};
