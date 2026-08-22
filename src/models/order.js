/* eslint-disable no-undef */
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    charger_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charger",
      required: true,
    },
    slot_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      trim: true,
    },
    receipt: {
      type: String,
      trim: true,
    },
    estimated_price: {
      type: Number,
      min: 0,
    },
    notes: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
