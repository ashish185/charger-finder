/* eslint-disable no-undef */
// utils/session.js: Issues and clears the httpOnly session cookie shared by
// the OTP login flow and any flow that changes claims baked into the token
// (e.g. role updates), so both stay in sync on how the token is signed/stored.
import jwt from "jsonwebtoken";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const issueSession = (res, user) => {
  const token = jwt.sign(
    {
      uid: user.userId.toString(),
      phone: user.phoneNumber,
      role: user.role || [],
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  const isProd = process.env.NODE_ENV === "production";
  console.log("****************IS Prod environment", isProd);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });

  return token;
};

export const clearSession = (res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
  });
};
