/* eslint-disable no-undef */
import mongoose from "mongoose";
import { CHARGING_TYPES, CONNECTORS, VEHICLE_SIZE } from "../constants.js";

const chargingOptionSchema = new mongoose.Schema(
  {
    charging_type: {
      type: String,
      required: true,
      enum: Object.values(CHARGING_TYPES),
    },
    connector_type: {
      type: String,
      required: true,
      enum: Object.values(CONNECTORS),
    },
  },
  { _id: false },
);

const vehicleSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nickname: {
      type: String,
      trim: true,
    },
    manufacturer: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    vehicle_type: {
      type: String,
      required: true,
      enum: Object.values(VEHICLE_SIZE),
    },
    registration_number: {
      type: String,
      trim: true,
      uppercase: true,
    },
    battery_capacity_kwh: {
      type: Number,
      min: 0,
    },
    charging_options: {
      type: [chargingOptionSchema],
      default: [],
    },
    range_km: {
      type: Number,
      min: 0,
    },
    is_default: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

vehicleSchema.index({ user_id: 1 });

export default mongoose.model("Vehicle", vehicleSchema);
