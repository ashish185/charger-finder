/* eslint-disable no-undef */
import mongoose from "mongoose";
import { STATIONS_STATUS } from "../constants.js";

const stationSchema = new mongoose.Schema(
  {
    operator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    amenities: [String],
    occupancy: [String],
    // Mixed: the cpo portal (station-service.js) stores {open, close, is_24x7};
    // the operator self-service flow (operator-station-service.js) stores a
    // plain "HH:mm-HH:mm" string per the operator-stations spec.
    operating_hours: mongoose.Schema.Types.Mixed,
    booking_rules: {
      advance_booking_minutes: { type: Number, min: 0, default: 0 },
      cancellation_window_minutes: { type: Number, min: 0, default: 0 },
    },
    payment_support: [{ type: String, trim: true }],
    support_contact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: Object.values(STATIONS_STATUS),
      default: STATIONS_STATUS.CLOSED,
      index: true,
    },
    trust_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    last_acknowledged_at: {
      type: Date,
    },
    delisted_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

stationSchema.index({ location: "2dsphere" });
stationSchema.index({ operator_id: 1, status: 1 });

export default mongoose.model("Station", stationSchema);
