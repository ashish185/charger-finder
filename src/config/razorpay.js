/* eslint-disable no-undef */
// config/razorpay.js: Configures the Razorpay SDK client used for creating orders and verifying webhooks.
import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpayInstance;
