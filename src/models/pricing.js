/* eslint-disable no-undef */
import mongoose from "mongoose";

const pricingSchema = new mongoose.Schema(
  {
    charger_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charger",
      required: true,
    },
    rate_per_kwh: {
      type: Number,
      required: true,
      min: 0,
    },
    reservation_fee: {
      type: Number,
      min: 0,
      default: 0,
    },
    platform_fee: {
      type: Number,
      min: 0,
      default: 0,
    },
    charging_efficiency: {
      type: Number,
      min: 0,
      max: 1,
      default: 1,
    },
    buffer_percentage: {
      type: Number,
      min: 0,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

pricingSchema.index({ charger_id: 1 }, { unique: true });

export default mongoose.model("Pricing", pricingSchema);
