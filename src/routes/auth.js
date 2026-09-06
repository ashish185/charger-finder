/* eslint-disable no-undef */
// routes/auth.js: Handles authentication-related endpoints like signup, login, logout, and profile.
import express from "express";
import { auth } from "../config/firebase.js";
import userService from "../services/user-service.js";
import { issueSession, clearSession } from "../utils/session.js";

const authRouter = express.Router();
/**
 * @openapi
 * /auth/otp/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify a Firebase phone OTP ID token and issue a session token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken: { type: string, description: Firebase ID token obtained after OTP verification }
 *     responses:
 *       200:
 *         description: OTP verified, session token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 sessionToken: { type: string }
 *                 phone: { type: string }
 *                 user: { type: object }
 *       400: { description: idToken is required }
 *       401: { description: Invalid or expired token }
 */
authRouter.post("/otp/verify", async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ error: "idToken required" });
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    const { phone_number } = decoded;

    const user = await userService.findOrCreateByPhoneNumber(phone_number);

    // Issue your own session token (recommended over trusting Firebase token on every request)
    issueSession(res, user);

    res.json({
      success: true,
      phone: phone_number,
      user,
    });
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Log out the currently logged-in user by clearing the session cookie.
 *     responses:
 *       200:
 *         description: Logged out.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string }
 */
authRouter.post("/logout", (req, res) => {
  clearSession(res);
  res.json({ success: true, message: "Logged out successfully" });
});

export default authRouter;
