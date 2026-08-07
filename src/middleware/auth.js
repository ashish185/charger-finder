/* eslint-disable no-undef */
// middleware/auth.js: Verifies JWT-based authentication for protected routes.
// Checks for a valid "Authorization: Bearer <token>" header before
// letting a request through to a protected route.

import jwt from "jsonwebtoken";

export function getTokenFromRequest(req) {
  return req.cookies?.token || null;
  // const authHeader = req.headers.authorization || "";

  // const cookieHeader = req.headers.cookie || "";
  // const tokenCookie = cookieHeader
  //   .split(";")
  //   .map((cookie) => cookie.trim())
  //   .find((cookie) => cookie.startsWith("token="));

  // if (tokenCookie) {
  //   return decodeURIComponent(tokenCookie.slice("token=".length));
  // }

  // return null;
}

export function requireAuth(req, res, next) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res.status(401).json({
      message: "No token provided",
      example: "Authorization: Bearer <your-jwt-here>",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
