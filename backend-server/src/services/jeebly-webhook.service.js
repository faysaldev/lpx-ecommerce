const { SellProducts, Order } = require("../models");

/**
 * Handle Jeebly Webhook
 * @param {Object} payload - Incoming webhook payload from Jeebly
 */
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

  console.log(`Webhook Received for ${reference_no}: Status = ${status}`);

  // Find all SellProducts with matching shippingId
  const sellProducts = await SellProducts.find({ shippingId: reference_no });

  if (!sellProducts.length) {
    console.warn(`⚠️ No SellProducts found for reference_no: ${reference_no}`);
    return `No products found for this reference_no ${reference_no}`;
  }

  // Update SellProducts status
  const updateResult = await SellProducts.updateMany(
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

  // Update order status only if final states
  const orderId = sellProducts[0].orderId;
  const finalStatuses = ["Delivered", "RTO Delivered", "Cancelled"];
  if (finalStatuses.includes(status)) {
    await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  }

  return {
    reference_no,
    updatedCount: updateResult.modifiedCount || 0,
    status,
  };
};

module.exports = {
  handleJeeblyWebhook,
};
