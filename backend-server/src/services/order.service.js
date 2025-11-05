const httpStatus = require("http-status");
const { Order, SellProducts } = require("../models");
const ApiError = require("../utils/ApiError");
const PDFDocument = require("pdfkit");
const fs = require("fs"); // For file system operations
const {
  cancelOrderShipment,
  createShipmentsForOrder,
} = require("../utils/jebbly-shipping.service");
const mongoose = require("mongoose");

const myOrders = async (
  userId,
  { status, sortBy = "newestFirst", page = 1, limit = 10 }
) => {
  const skip = (page - 1) * limit;
  const searchQuery = { customer: userId, status: { $ne: "unpaid" } };

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
      .select("orderID status totalAmount shippingInformation createdAt")
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOrder)
      .populate("customer", "name email image")
      .lean();

    if (!orders.length) {
      return {
        orders: [],
        currentPage: page,
        totalPages: 0,
        totalOrders: 0,
      };
    }

    // Fetch SellProducts for each order
    for (let order of orders) {
      const items = await SellProducts.find({ orderId: order._id })
        .populate("productId", "productName")
        .populate("vendorId", "storeName email")
        .select("productId quantity price vendorId status image")
        .lean();

      order.items = items.map((item) => {
        if (item.productId?.images?.length > 0) {
          const firstImage = item.productId.images[0];
          item.productId.images[0] = `${firstImage}_modified`;
        }
        return item;
      });

      order.itemsCount = order.items.length;
    }

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
      path: "customer",
      select: "name email phoneNumber address image",
    })
    .lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const items = await SellProducts.find({ orderId: order._id })
    .populate("vendorId", "storeName email")
    .select("productId vendorId quantity price status image")
    .lean();

  order.totalItems = items.map((item) => {
    if (item.productId?.images?.length > 0) {
      const firstImage = item.productId.images[0];
      item.productId.images[0] = `${firstImage}`;
    }
    return item;
  });

  order.itemsCount = items.length;

  return order;
};
// todo:single one done

const getOrderSingleStatusUpdate = async (orderId, status) => {
  try {
    let shipmentResponses = [];

    // Handle "shipped" status: create shipments
    if (status === "shipped") {
      shipmentResponses = await createShipmentsForOrder(orderId);
      if (
        !shipmentResponses ||
        shipmentResponses.some((response) => response.success !== "true")
      ) {
        throw new Error(
          "Error during shipment creation: one or more shipments failed"
        );
      }
    } else if (status === "cancelled") {
      // Handle "cancelled" status: cancel shipments
      const cancellationResponses = await cancelOrderShipment(orderId);
      if (
        !cancellationResponses ||
        cancellationResponses.some((response) => response.success !== "true")
      ) {
        throw new Error(
          "Error during shipment cancellation: one or more cancellations failed"
        );
      }
    }

    // Update SellProducts status (no transaction)
    const updateSellProductsResult = await SellProducts.updateMany(
      { orderId },
      { $set: { status } }
    );

    if (
      !updateSellProductsResult.modifiedCount &&
      !updateSellProductsResult.nModified
    ) {
      console.warn(`⚠️ No SellProducts updated for order ${orderId}`);
    }

    // Update Order status (no transaction)
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      throw new Error("Failed to update order status.");
    }
    return updatedOrder;
  } catch (error) {
    console.error("❌ Error during status update:", error.message);
    throw error;
  }
};

const getOrderSingleShippingUpdates = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  return order;
};

const editeSingleOrder = async (orderId, newData) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const updateData = {
    status: newData.status || undefined,
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

  // Update the order itself
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  }).lean();

  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Fetch related SellProducts
  const sellProducts = await SellProducts.find({ orderId })
    .populate("vendorId", "email seller ownerName")
    .populate("productId", "productName price")
    .select("productId vendorId quantity price")
    .lean();

  // Prepare vendor and product detail summary
  const vendorDetails = sellProducts.map((item) => {
    const totalPrice = item.price * item.quantity;

    return {
      productId: item.productId?._id,
      productName: item.productId?.productName || "Unnamed Product",
      quantity: item.quantity,
      vendorId: item.vendorId?._id,
      email: item.vendorId?.email,
      sellerId: item.vendorId?.seller,
      productPrice: totalPrice,
      ownerName: item.vendorId?.ownerName,
      vendorEmail: item.vendorId?.email,
    };
  });

  return vendorDetails;
};

const generateInvoicePDF = async (order, items) => {
  const doc = new PDFDocument({ margin: 50 });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));

  return new Promise(async (resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);

    try {
      const logoUrl = "https://i.ibb.co.com/kPsKmt1/LPX-01.png";

      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("LPX Collect", 400, 50, { align: "right" });
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Dubai, Abu Dhabi", 400, 75, { align: "right" });
      doc.text("Phone: +971 52 472 6662", 400, 90, { align: "right" });
      doc.text("Email: khaled@lpx.ae", 400, 105, {
        align: "right",
      });

      doc.fontSize(28).font("Helvetica-Bold").text("INVOICE", 50, 150);

      const invoiceDetailsY = 190;
      doc.fontSize(10).font("Helvetica");
      doc.text(`Invoice Number: INV-${order.orderID}`, 50, invoiceDetailsY);
      doc.text(
        `Invoice Date: ${new Date().toLocaleDateString()}`,
        50,
        invoiceDetailsY + 15
      );
      doc.text(`Order ID: ${order.orderID}`, 50, invoiceDetailsY + 30);

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("BILL TO:", 50, invoiceDetailsY + 60);
      doc.fontSize(10).font("Helvetica");
      doc.text(order.customer.name, 50, invoiceDetailsY + 78);
      doc.text(order.customer.email, 50, invoiceDetailsY + 93);
      doc.text(order.customer.phoneNumber, 50, invoiceDetailsY + 108);

      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("SHIP TO:", 320, invoiceDetailsY + 60);
      doc.fontSize(10).font("Helvetica");
      doc.text(
        order.shippingInformation.streetAddress || "N/A",
        320,
        invoiceDetailsY + 78,
        { width: 200 }
      );
      doc.text(
        `${order.shippingInformation.state || ""}, ${
          order.shippingInformation.country || ""
        }`,
        320,
        invoiceDetailsY + 93
      );
      if (order.shippingInformation.deliveryInstructions) {
        doc
          .fontSize(9)
          .text(
            `Note: ${order.shippingInformation.deliveryInstructions}`,
            320,
            invoiceDetailsY + 113,
            { width: 200 }
          );
      }

      const tableTop = invoiceDetailsY + 150;
      doc.fontSize(10).font("Helvetica-Bold");
      doc.rect(50, tableTop, 495, 25).fillAndStroke("#4A5568", "#4A5568");
      doc.fillColor("#FFFFFF");
      doc.text("Item", 60, tableTop + 8, { width: 200 });
      doc.text("Qty", 270, tableTop + 8, { width: 50, align: "center" });
      doc.text("Price", 330, tableTop + 8, { width: 80, align: "right" });
      doc.text("Total", 420, tableTop + 8, { width: 80, align: "right" });

      doc.fillColor("#000000").font("Helvetica");
      let currentY = tableTop + 35;

      items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        if (index % 2 === 0) {
          doc
            .rect(50, currentY - 5, 495, 25)
            .fillAndStroke("#F7FAFC", "#E2E8F0");
        } else {
          doc.rect(50, currentY - 5, 495, 25).stroke("#E2E8F0");
        }

        doc.fillColor("#000000");
        doc.text(item?.productId?.productName || "Product", 60, currentY, {
          width: 200,
        });
        doc.text(item.quantity.toString(), 270, currentY, {
          width: 50,
          align: "center",
        });
        doc.text(`AED ${item.price.toFixed(2)}`, 330, currentY, {
          width: 80,
          align: "right",
        });
        doc.text(`AED ${itemTotal.toFixed(2)}`, 420, currentY, {
          width: 80,
          align: "right",
        });
        currentY += 25;
      });

      doc.moveTo(50, currentY).lineTo(545, currentY).stroke("#E2E8F0");

      if (order.orderNotes) {
        currentY += 20;
        doc.fontSize(9).font("Helvetica-Oblique");
        doc.text(`Notes: ${order.orderNotes}`, 60, currentY, { width: 300 });
      }

      const summaryX = 380;
      currentY += 40;

      doc.fontSize(10).font("Helvetica");
      doc.text("Subtotal:", summaryX, currentY);
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      doc.text(`AED ${subtotal.toFixed(2)}`, summaryX + 100, currentY, {
        width: 65,
        align: "right",
      });

      currentY += 20;
      doc.text("Shipping:", summaryX, currentY);
      doc.text(`AED ${order.shipping.toFixed(2)}`, summaryX + 100, currentY, {
        width: 65,
        align: "right",
      });

      currentY += 20;
      doc.text("Tax:", summaryX, currentY);
      doc.text(`AED ${order.tax.toFixed(2)}`, summaryX + 100, currentY, {
        width: 65,
        align: "right",
      });

      currentY += 25;
      doc
        .rect(summaryX - 10, currentY - 5, 175, 25)
        .fillAndStroke("#4A5568", "#4A5568");
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc.text("TOTAL:", summaryX, currentY + 3);
      doc.text(
        `AED ${(subtotal + order.shipping + order.tax).toFixed(2)}`,
        summaryX + 60,
        currentY + 3,
        { width: 100, align: "right" }
      );

      doc.fontSize(9).font("Helvetica").fillColor("#718096");
      doc.text("Thank you for your business!", 50, doc.page.height - 80, {
        align: "center",
        width: 495,
      });
      doc.text(
        "For any questions, please contact us at khaled@lpx.ae",
        50,
        doc.page.height - 65,
        { align: "center", width: 495 }
      );

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

const getOrderSingleDetailsInvoice = async (orderId) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  const order = await Order.findById(orderId)
    .populate({
      path: "customer",
      select: "name email phoneNumber address image",
    })
    .lean();

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const items = await SellProducts.find({ orderId: order._id })
    .populate("productId", "productName description category price images")
    .populate("vendorId", "storeName email")
    .select("productId vendorId quantity price status image")
    .lean();

  const pdfBuffer = await generateInvoicePDF(order, items);
  return pdfBuffer;
};

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
  editeSingleOrder,
  getOrderSingleDetailsInvoice,
  getOrderSingleStatusUpdate,
  getOrderSingleShippingUpdates,
};
