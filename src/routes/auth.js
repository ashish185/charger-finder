/* eslint-disable no-undef */
// routes/auth.js: Handles authentication-related endpoints like signup, login, logout, and profile.
import express from "express";
import { getAuth } from "firebase-admin/auth";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("otp/verify", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "idToken required" });
  }

  try {
    const decoded = await getAuth().verifyIdToken(idToken);
    const { uid, phone_number } = decoded;

    // Look up or create your own user record here
    // e.g. const user = await UserRepository.findOrCreateByPhone(phone_number);

    // Issue your own session token (recommended over trusting Firebase token on every request)
    const sessionToken = jwt.sign(
      { uid, phone: phone_number },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({ success: true, sessionToken, phone: phone_number });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

export default authRouter;
