const axios = require("axios");
const { Order, SellProducts, Product, Vendor } = require("../models");

const createShipment = async (data) => {
  const url = "https://demo.jeebly.com/customer/create_shipment";
  const headers = {
    "X-API-KEY": "JjEeEeBbLlYy1200", //process.env.JEEBLY_X_API_KEY,
    client_key: "1118X251014011357Y4b68616c6564456c736164656b", //process.env.JEEBLY_CLIENT_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // Return the response from the API
  } catch (error) {
    console.error(
      "Error creating shipment:",
      error.response ? error.response.data : error.message
    );
    throw error; // You can throw or handle the error as you need
  }
};

const cancelShipment = async (reference_number) => {
  const url = "https://demo.jeebly.com/customer/cancel_shipment";
  const headers = {
    "X-API-KEY": "JjEeEeBbLlYy1200", //process.env.JEEBLY_X_API_KEY,
    client_key: "1118X251014011357Y4b68616c6564456c736164656b", //process.env.JEEBLY_CLIENT_KEY,
    "Content-Type": "application/json",
  };
  const data = { reference_number };
  try {
    const response = await axios.post(url, data, { headers });
    return response.data; // Return the response from the API
  } catch (error) {
    console.error(
      "Error canceling shipment:",
      error.response ? error.response.data : error.message
    );
    throw error; // You can throw or handle the error as you need
  }
};

// Function to create shipment for all products of an order
const createShipmentsForOrder = async (orderId) => {
  try {
    // Step 1: Find the order and customer information
    const order = await Order.findById(orderId).populate("customer");
    if (!order) throw new Error("Order not found");

    const shippingInformation = order.shippingInformation;

    // Step 2: Find all SellProducts for this order
    const sellProducts = await SellProducts.find({ orderId: orderId });
    if (!sellProducts.length)
      throw new Error("No products found for this order.");

    // Step 3: Group products by vendorId
    const groupedByVendor = sellProducts.reduce((acc, product) => {
      const vendorId = product.vendorId.toString();
      if (!acc[vendorId]) acc[vendorId] = [];
      acc[vendorId].push(product);
      return acc;
    }, {});

    // Step 4: Prepare and create shipments per vendor
    const shipmentPromises = Object.entries(groupedByVendor).map(
      async ([vendorId, vendorProducts]) => {
        const vendor = await Vendor.findById(vendorId).select(
          "seller ownerName firstName lastName storeName email city country contactEmail phoneNumber location productsCount"
        );
        if (!vendor) throw new Error(`Vendor not found with ID: ${vendorId}`);

        // Fetch product details for all products of this vendor
        const productDetails = await Promise.all(
          vendorProducts.map((p) => Product.findById(p.productId))
        );

        // Combine description and total quantity
        const totalPieces = vendorProducts.reduce(
          (sum, p) => sum + (p.quantity || 0),
          0
        );

        const description = productDetails
          .map((p) => p?.productName || "Unnamed Product")
          .join(", ");

        console.log(vendor, "vendor Information");

        // Construct shipment data for the vendor
        const shipmentData = {
          delivery_type: "Next Day",
          load_type: "Non-document",
          consignment_type: "Forward",
          description,
          weight:
            productDetails.reduce(
              (sum, p) => sum + (p?.shipping?.weight || 1),
              0
            ) || 1,
          payment_type: "prepaid",
          cod_amount: 0,
          num_pieces: totalPieces,
          consignment_number: `Order-${orderId}-${vendorId}`,

          // Origin — Seller info
          origin_address_name: vendor.storeName || vendor.ownerName,
          origin_address_mob_no_country_code:
            "+971" || vendor.phoneNumber.slice(0, 4),
          origin_address_mobile_number:
            vendor.phoneNumber || vendor.phoneNumber.slice(4),
          origin_address_house_no:
            vendor.location.split(" ")[0] || vendor.location,
          origin_address_building_name:
            vendor.location.split(" ")[1] || vendor.location,
          origin_address_area: vendor.location.split(" ")[2] || vendor.location,
          origin_address_landmark: "N/A",
          origin_address_city: vendor.city || "N/A",
          origin_address_type: "Normal",

          // Destination — Customer shipping info
          destination_address_name: shippingInformation.name,
          destination_address_mob_no_country_code:
            shippingInformation.phoneNumber.slice(0, 4),
          destination_address_mobile_number:
            shippingInformation.phoneNumber.slice(4),
          destination_address_house_no: shippingInformation.streetAddress,
          destination_address_building_name: shippingInformation.streetAddress,
          destination_address_area: shippingInformation.streetAddress,
          destination_address_landmark: shippingInformation.landmark || "N/A",
          destination_address_city: shippingInformation.city || "N/A",
          destination_address_type: "Western",
          // Tomorrow's date
          pickup_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        };

        // Step 5: Call Jeebly API
        console.log("Shipment Data:", shipmentData);
        const response = await createShipment(shipmentData);

        if (response.success === "true") {
          // Step 6: Update all SellProducts for this vendor
          const awbNumber = response["AWB No"];
          await SellProducts.updateMany(
            { orderId: orderId, vendorId: vendorId },
            { $set: { shippingId: awbNumber } }
          );
        }

        return response;
      }
    );

    // Wait for all vendor shipments
    const shipmentResponses = await Promise.all(shipmentPromises);
    return shipmentResponses;
  } catch (error) {
    console.error("Error creating shipments:", error);
    throw error;
  }
};

// Function to handle order cancellation
const cancelOrderShipment = async (orderId) => {
  try {
    // Step 1: Find the order and its associated sell products
    const sellProducts = await SellProducts.find({ orderId: orderId });
    if (!sellProducts.length)
      throw new Error("No products found for this order.");

    // Step 2: Check each sell product if it has a shippingId (AWB No)
    const cancelPromises = sellProducts.map(async (sellProduct) => {
      if (sellProduct.shippingId) {
        const cancelResponse = await cancelShipment(sellProduct.shippingId);
        if (cancelResponse.success === "true") {
          // Update status of sellProduct to "Cancelled" if shipment is successfully canceled
          sellProduct.status = "Cancelled";
          await sellProduct.save();
        }
        return cancelResponse;
      } else {
        console.log("No shippingId found for product, skipping cancellation.");
      }
    });

    // Step 3: Wait for all cancelations
    const cancelResponses = await Promise.all(cancelPromises);
    return cancelResponses;
  } catch (error) {
    console.error("Error canceling order shipment:", error);
    throw error; // Propagate error to be handled by the caller
  }
};

module.exports = {
  createShipment,
  cancelShipment,
  createShipmentsForOrder,
  cancelOrderShipment,
};
