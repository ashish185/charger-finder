/* eslint-disable no-undef */
import mongoose from "mongoose";

const stationSchema = new mongoose.Schema(
  {
    operator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
    },
    name: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
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
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

stationSchema.index({ location: "2dsphere" });

export default mongoose.model("Station", stationSchema);
