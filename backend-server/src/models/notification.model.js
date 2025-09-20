const mongoose = require("mongoose");
const { Schema } = mongoose;
const { roles } = require("../config/roles");

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    transactionId: {
      type: String,
      required: false,
      default: null,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false, // Default is unread
    },
    type: {
      type: String,
      enum: ["orders", "systems", "promotions", "vendor", "price alerts"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    isDeleted: {
      type: Boolean,
      default: false, // Default is not deleted
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
