/* eslint-disable no-undef */
// server.js: Main entry point for the Express backend server.
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./src/routes/index.js";
import connectToDatabase from "./src/config/database.js";
import cookieParser from "cookie-parser";
import swaggerSpec from "./swagger.js";
import swaggerUi from "swagger-ui-express";

dotenv.config();

if (!process.env.JWT_SECRET) {
  console.error(
    "Missing JWT_SECRET in backend environment. Add JWT_SECRET to backend/.env or your process environment.",
  );
  process.exit(1);
}

const app = express();

// CORS_ORIGIN can be a comma-separated list, e.g.
// "http://localhost:5173,https://my-app.vercel.app"
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (curl, Postman, server-to-server) with no Origin header
      if (!origin) {
        return callback(null, true);
      }
      console.log("allowedOrigins", allowedOrigins, origin);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// Health check - Render (and you) can use this to confirm the service is alive
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Login API is running" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Basic error handler (e.g. catches the CORS error thrown above)
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: err.message || "Something went wrong" });
});

const PORT = process.env.PORT;

connectToDatabase().then(() => {
  console.log("Database connection established...");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
