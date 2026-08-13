/* eslint-disable no-undef */
import mongoose from "mongoose";

const operatorSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    gstNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    agreedToTerms: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Operator", operatorSchema);
