const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GeneralSchema = new Schema(
  {
    categories: [
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, default: "" },
      },
    ],

    coupons: [
      {
        code: { type: String, required: true, uppercase: true, trim: true },
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        isActive: { type: Boolean, default: true },
        expiryDate: { type: Date },
      },
    ],

    shippingCharge: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingChargeVendor: {
      type: Number,
      required: true,
      default: 0,
    },

    platformCharge: {
      type: Number,
      required: true,
      default: 0,
    },

    estimatedTax: {
      type: Number,
      required: true,
      default: 0,
    },

    conditions: [
      {
        type: String,
      },
    ],
    tags: [String], // New field for tags (array of strings)
  },
  { timestamps: true }
);

const General = mongoose.model("General", GeneralSchema);

module.exports = General;
