/* eslint-disable no-undef */
import mongoose from "mongoose";

const chargerSchema = new mongoose.Schema(
  {
    station_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },
    connector_type: {
      type: String,
      required: true,
      trim: true,
    },
    charging_type: {
      type: String,
      trim: true,
    },
    connector: {
      type: String,
      trim: true,
    },
    max_power_kw: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    price_per_kwh: {
      type: Number,
      required: true,
      min: 0,
    },
    price_per_minute: {
      type: Number,
      min: 0,
      default: null,
    },
    price_effective_from: {
      type: Date,
      default: null,
    },
    vehicle_compatibility: [
      {
        type: String,
        enum: ["2W_scooter", "2W_motorcycle", "3W", "4W"],
      },
    ],
    pricing_history: [
      {
        price_per_kwh: { type: Number, min: 0 },
        price_per_minute: { type: Number, min: 0, default: null },
        effective_from: { type: Date, required: true },
      },
    ],
    is_deleted: {
      type: Boolean,
      default: false,
    },
    last_updated_at: {
      type: Date,
    },
    last_updated_source: {
      type: String,
      trim: true,
    },
    fault_flag: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

chargerSchema.index({ station_id: 1 });

export default mongoose.model("Charger", chargerSchema);
