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
