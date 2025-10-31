const { handleJeeblyWebhook } = require("../services/jeebly-webhook.service");

const jeeblyWebhook = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // Verify API Key for security
    if (!apiKey || apiKey !== process.env.JEEBLY_X_API_KEY) {
      return res.status(403).json({ message: "Invalid or missing API key" });
    }

    // Process payload
    const result = await handleJeeblyWebhook(req.body);

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
      data: result,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};

module.exports = {
  jeeblyWebhook,
};
