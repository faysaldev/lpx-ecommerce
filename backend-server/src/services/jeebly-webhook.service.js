const { SellProducts } = require("../models");
const { orderWebhookUpdates } = require("../utils/orderNotifyupdates");

const handleJeeblyWebhook = async (payload) => {
  const {
    reference_no,
    status,
    desc,
    event_date_time,
    hub_name,
    rider_name,
    rider_code,
    failure_reason,
    pod_image,
  } = payload;

  if (!reference_no || !status) {
    throw new Error("Missing required fields: reference_no or status");
  }

  // Find sell products linked to this shipment
  const sellProducts = await SellProducts.find({ shippingId: reference_no });

  if (!sellProducts.length) {
    console.warn(`⚠️ No SellProducts found for reference_no: ${reference_no}`);
    return `No products found for this reference_no ${reference_no}`;
  }

  // Update SellProduct(s) matching the shipping reference
  await SellProducts.updateMany(
    { shippingId: reference_no },
    {
      $set: {
        status,
        webhookMeta: {
          description: desc || "",
          hub_name: hub_name || "",
          event_date_time: event_date_time || new Date(),
          rider_name: rider_name || "",
          rider_code: rider_code || "",
          failure_reason: failure_reason || "",
          pod_image: pod_image || null,
        },
      },
    }
  );

  // Get the related order ID
  const orderId = sellProducts[0].orderId;

  // Fetch all SellProducts for the same order
  const allOrderProducts = await SellProducts.find({ orderId });

  // Determine if every product in the order is Delivered
  const allDelivered = allOrderProducts.every(
    (sp) => sp.status === "Delivered"
  );
  const allCancelled = allOrderProducts.every(
    (sp) => sp.status === "cancelled"
  );

  if (allDelivered) {
    // Only mark order delivered once *all* products delivered
    await orderWebhookUpdates(orderId, "Delivered");
  } else if (allCancelled) {
    await orderWebhookUpdates(orderId, "Cancelled");
  } else {
    // Otherwise, update the order with the latest individual status
    await orderWebhookUpdates(orderId, status);
  }

  return {
    reference_no,
    updatedCount: sellProducts.length,
    status,
    orderId,
    message: allDelivered
      ? "All products delivered. Order marked as Delivered."
      : `Product(s) updated to ${status}`,
  };
};

module.exports = {
  handleJeeblyWebhook,
};
