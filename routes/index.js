// routes/index.js: Central router that mounts all API route modules.
import { Router } from "express";
import authRouter from "./auth.js";
import healthCheckRouter from "./health-check.js";
import chargersRouter from "./chargers.js";

const v1Router = Router();

// User routes (CRUD + login)
v1Router.use("/auth", authRouter);

v1Router.use("/api/v1", healthCheckRouter);

// Charger discovery and details.
v1Router.use("/api/v1/chargers", chargersRouter);

export default v1Router;
