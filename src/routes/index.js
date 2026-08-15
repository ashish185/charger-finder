// routes/index.js: Central router that mounts all API route modules.
import { Router } from "express";
import authRouter from "./auth.js";
import healthCheckRouter from "./health-check.js";
import chargersRouter from "./chargers.js";
import cpoStationsRouter from "./cpo-stations.js";
import pricingRouter from "./pricing.js";
import stationsRouter from "./stations.js";
import userRouter from "./user.js";

const v1Router = Router();

// User routes (CRUD + login)
v1Router.use("/api/v1/auth", authRouter);

v1Router.use("/api/v1", healthCheckRouter);

// Charger discovery and details.
v1Router.use("/api/v1/chargers", chargersRouter);

// CPO portal station and charger management.
v1Router.use("/api/v1/cpo/stations", cpoStationsRouter);

// CPO portal charger pricing config management.
v1Router.use("/api/v1/cpo/chargers", pricingRouter);

// Public station discovery (nearby stations with available charger counts).
v1Router.use("/api/v1/stations", stationsRouter);

// User registration and profile.
v1Router.use("/api/v1/user", userRouter);

export default v1Router;
