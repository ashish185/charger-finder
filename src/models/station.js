/* eslint-disable no-undef */
import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    operator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
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
    operating_hours: {
      open: { type: String, trim: true },
      close: { type: String, trim: true },
      is_24x7: { type: Boolean, default: false },
    },
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
      enum: ["draft", "pending_review", "live", "maintenance", "delisted"],
      default: "draft",
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
