/* eslint-disable no-undef */
// models/user.js: Defines the User schema and related helper methods.
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (value && !validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      validate(value) {
        if (value && !validator.isStrongPassword(value)) {
          throw new Error("Enter a Strong Password");
        }
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    payment_methods: [
      {
        type: { type: String, enum: ["CREDIT_CARD", "DIGITAL_WALLET"] },
        provider: String,
      },
    ],
    agreed_to_terms: {
      type: Boolean,
    },
    role: {
      type: [String],
      default: ["customer"],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const jwtSecureKey = process.env.JWT_SECRET;
  if (!jwtSecureKey) {
    throw new Error("JWT secure key is not defined in environment variables");
  }
  const token = jwt.sign({ _id: user._id }, jwtSecureKey, {
    expiresIn: "7d",
  });
  return token;
};
userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );

  return isPasswordValid;
};
export default mongoose.model("User", userSchema);
