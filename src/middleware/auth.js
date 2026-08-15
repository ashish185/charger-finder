/* eslint-disable no-undef */
// middleware/auth.js: Verifies JWT-based authentication for protected routes.
// Checks for a valid "Authorization: Bearer <token>" header before
// letting a request through to a protected route.

import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies?.token || null;

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

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}
