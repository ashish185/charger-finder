// routes/index.js: Central router that mounts all API route modules.
import { Router } from "express";
import authRouter from "./auth.js";

const v1Router = Router();

// User routes (CRUD + login)
v1Router.use("/auth", authRouter);

v1Router.use("/api/v1", v1Router);

export default v1Router;
