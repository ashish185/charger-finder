/* eslint-disable no-undef */
import swaggerJsdoc from "swagger-jsdoc";

const baseUrl = process.env.API_URL
  ? process.env.API_URL.replace(/\/$/, "")
  : "";
const serverUrl = baseUrl ? `${baseUrl}/api/v1` : "/api/v1";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Charger Finder",
      version: "1.0.0",
      description: "API Documentation",
    },
    servers: [
      {
        url: serverUrl,
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

export default swaggerJsdoc(options);
