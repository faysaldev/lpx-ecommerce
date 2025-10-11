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

const getOrderSingleStatusUpdate = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(orderId, { status });

  return order;
};

// todo: working to stripe webhook to update all the details
const editeSingleOrder = async (orderId, newData) => {
  if (!orderId) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Order ID is required");
  }

  // Update data for the order
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

  // Find the order by its ID and populate vendor details (including ownerName and email)
  const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
    new: true,
  }).populate({
    path: "totalItems.vendorId",
    select: "email seller ownerName", // Populate email, seller, and ownerName
  });

  if (!updatedOrder) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  // Extract the vendor details and calculate price for each product, including productId, quantity, ownerName, and email
  const vendorDetails = updatedOrder.totalItems.map((item) => {
    // Calculate price for each item by multiplying the quantity with the price
    const totalPrice = item.price * item.quantity;

    return {
      productId: item.productId, // Product ID
      quantity: item.quantity, // Quantity of the product
      vendorId: item.vendorId._id, // Vendor ID
      email: item.vendorId.email, // Vendor email
      sellerId: item.vendorId.seller, // Seller's user ID
      productPrice: totalPrice, // Calculated price (price * quantity)
      ownerName: item.vendorId.ownerName, // Vendor owner name
      vendorEmail: item.vendorId.email, // Vendor email (again here for clarity)
    };
  });

  return vendorDetails;
};

const generateInvoicePDF = async (order) => {
  const doc = new PDFDocument({ margin: 50 });

  // Creating PDF in memory
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  return new Promise(async (resolve, reject) => {
    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);
      resolve(pdfBuffer);
    });
    doc.on("error", reject);

    try {
      // Company Header with Logo
      const logoUrl = "https://i.ibb.co.com/kPsKmt1/LPX-01.png";
      // Note: You'll need to fetch and add the logo image
      // const logoResponse = await fetch(logoUrl);
      // const logoBuffer = await logoResponse.buffer();
      // doc.image(logoBuffer, 50, 45, { width: 80 });

      // Company Info (Right side)
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .text("LPX Collect", 400, 50, { align: "right" });
      doc
        .fontSize(10)
        .font("Helvetica")
        .text("Dubai, Abu Dhabi", 400, 75, { align: "right" });
      doc.text("Phone: +971 29873497234", 400, 90, { align: "right" });
      doc.text("Email: faysalworkspace@gmail.com", 400, 105, {
        align: "right",
      });

      // Invoice Title
      doc.fontSize(28).font("Helvetica-Bold").text("INVOICE", 50, 150);

      // Invoice Details Box
      doc.fontSize(10).font("Helvetica");
      const invoiceDetailsY = 190;
      doc.text(`Invoice Number: INV-${order.orderID}`, 50, invoiceDetailsY);
      doc.text(
        `Invoice Date: ${new Date().toLocaleDateString()}`,
        50,
        invoiceDetailsY + 15
      );
      doc.text(`Order ID: ${order.orderID}`, 50, invoiceDetailsY + 30);

      // Customer Details Box
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("BILL TO:", 50, invoiceDetailsY + 60);
      doc.fontSize(10).font("Helvetica");
      doc.text(order.customer.name, 50, invoiceDetailsY + 78);
      doc.text(order.customer.email, 50, invoiceDetailsY + 93);
      doc.text(order.customer.phoneNumber, 50, invoiceDetailsY + 108);

      // Shipping Address
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text("SHIP TO:", 320, invoiceDetailsY + 60);
      doc.fontSize(10).font("Helvetica");
      doc.text(
        order.shippingInformation.streetAddress,
        320,
        invoiceDetailsY + 78,
        { width: 200 }
      );
      doc.text(
        `${order.shippingInformation.state}, ${order.shippingInformation.country}`,
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

      // Table Header
      const tableTop = invoiceDetailsY + 150;
      doc.fontSize(10).font("Helvetica-Bold");

      // Draw table header background
      doc.rect(50, tableTop, 495, 25).fillAndStroke("#4A5568", "#4A5568");

      // Table Headers (White text on dark background)
      doc.fillColor("#FFFFFF");
      doc.text("Item", 60, tableTop + 8, { width: 200 });
      doc.text("Qty", 270, tableTop + 8, { width: 50, align: "center" });
      doc.text("Price", 330, tableTop + 8, { width: 80, align: "right" });
      doc.text("Total", 420, tableTop + 8, { width: 80, align: "right" });

      // Reset text color for table body
      doc.fillColor("#000000");
      doc.font("Helvetica");

      // Table Rows
      let currentY = tableTop + 35;
      order.totalItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;

        // Alternate row background
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

      // Draw bottom border of table
      doc.moveTo(50, currentY).lineTo(545, currentY).stroke("#E2E8F0");

      // Order Notes (if any)
      if (order.orderNotes) {
        currentY += 20;
        doc.fontSize(9).font("Helvetica-Oblique");
        doc.text(`Notes: ${order.orderNotes}`, 60, currentY, { width: 300 });
      }

      // Summary Box (Right aligned)
      const summaryX = 380;
      currentY += 40;

      doc.fontSize(10).font("Helvetica");
      doc.text("Subtotal:", summaryX, currentY);
      doc.text(
        `AED ${order.totalAmount.toFixed(2)}`,
        summaryX + 100,
        currentY,
        {
          width: 65,
          align: "right",
        }
      );

      currentY += 20;
      doc.text("Shipping:", summaryX, currentY);
      doc.text(`$${0}`, summaryX + 100, currentY, {
        width: 65,
        align: "right",
      });

      currentY += 20;
      doc.text("Tax:", summaryX, currentY);
      doc.text(`AED ${order.tax.toFixed(2)}`, summaryX + 100, currentY, {
        width: 65,
        align: "right",
      });

      // Total with background
      currentY += 25;
      doc
        .rect(summaryX - 10, currentY - 5, 175, 25)
        .fillAndStroke("#4A5568", "#4A5568");
      doc.fontSize(12).font("Helvetica-Bold").fillColor("#FFFFFF");
      doc.text("TOTAL:", summaryX, currentY + 3);
      doc.text(
        `AED ${(order.totalAmount + order.shipping + order.tax).toFixed(2)}`,
        summaryX + 100,
        currentY + 3,
        { width: 65, align: "right" }
      );

      // Footer
      doc.fontSize(9).font("Helvetica").fillColor("#718096");
      doc.text("Thank you for your business!", 50, doc.page.height - 80, {
        align: "center",
        width: 495,
      });
      doc.text(
        "For any questions, please contact us at faysalworkspace@gmail.com",
        50,
        doc.page.height - 65,
        { align: "center", width: 495 }
      );

      // Finalize the PDF
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
    .populate({
      path: "totalItems.productId",
      select: "productName description category price images",
    })
    .populate({
      path: "totalItems.vendorId",
      select: "storeName",
    });

  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  const pdfBuffer = await generateInvoicePDF(order);
  return pdfBuffer;
};

module.exports = {
  myOrders,
  createOrder,
  getOrderSingleDetails,
  editeSingleOrder,
  getOrderSingleDetailsInvoice,
  getOrderSingleStatusUpdate,
};
