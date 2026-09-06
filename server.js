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

const allowedOrigins = ["https://charger-finder-ui.onrender.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

      const isProduction = allowedOrigins.includes(origin);

      if (isLocalhost || isProduction) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(
  cors({
    origin: "https://charger-finder-ui.onrender.com",
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
