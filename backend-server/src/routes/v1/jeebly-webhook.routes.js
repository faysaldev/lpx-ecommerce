const express = require("express");
const router = express.Router();
const jeeblyWebhookController = require("../../controllers/jeebly-webhook.controller");

// Webhook endpoint
router.post("/webhook", jeeblyWebhookController.jeeblyWebhook);

module.exports = router;
