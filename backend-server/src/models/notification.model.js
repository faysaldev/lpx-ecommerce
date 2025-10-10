const mongoose = require("mongoose");
const { Schema } = mongoose;
const { roles } = require("../config/roles");

const notificationSchema = new Schema(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sendTo: {
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
      enum: ["orders", "system", "promotion", "vendor", "price_alert"],
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
