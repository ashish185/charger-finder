/* eslint-disable no-undef */
// routes/health-check.js: Handles health check endpoints.
import express from "express";

const healthCheckRouter = express.Router();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Get health check information
 *     responses:
 *       200:
 *         description: Health check information
 */
healthCheckRouter.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Health check API is running" });
});

export default healthCheckRouter;
