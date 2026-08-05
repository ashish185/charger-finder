/* eslint-disable no-undef */
// routes/health-check.js: Handles health check endpoints.
import express from "express";

const healthCheckRouter = express.Router();

healthCheckRouter.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Health check API is running" });
});

export default healthCheckRouter;
