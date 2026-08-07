/* eslint-disable no-undef */
// models/user.js: Defines the User schema and related helper methods.
import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // firstName: {
    //   type: String,
    //   required: true,
    //   minLength: 4,
    //   maxLength: 50,
    // },
    // lastName: {
    //   type: String,
    // },
    // emailId: {
    //   type: String,
    //   lowercase: true,
    //   required: true,
    //   unique: true,
    //   trim: true,
    //   validate(value) {
    //     if (!validator.isEmail(value)) {
    //       throw new Error("Invalid email address: " + value);
    //     }
    //   },
    // },
    // password: {
    //   type: String,
    //   required: true,
    //   validate(value) {
    //     if (!validator.isStrongPassword(value)) {
    //       throw new Error("Enter a Strong Password: " + value);
    //     }
    //   },
    // },
  },
  {
    timestamps: true,
  },
);

// userSchema.methods.getJWT = async function () {
//   const user = this;
//   const jwtSecureKey = process.env.JWT_SECRET;
//   if (!jwtSecureKey) {
//     throw new Error("JWT secure key is not defined in environment variables");
//   }
//   const token = await jwt.sign({ _id: user._id }, jwtSecureKey, {
//     expiresIn: "7d",
//   });

//   return token;
// };

// userSchema.methods.validatePassword = async function (passwordInputByUser) {
//   const user = this;
//   const passwordHash = user.password;

//   const isPasswordValid = await bcrypt.compare(
//     passwordInputByUser,
//     passwordHash,
//   );

//   return isPasswordValid;
// };

export default mongoose.model("User", userSchema);
