/* eslint-disable no-undef */
import swaggerJsdoc from "swagger-jsdoc";

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
        url: process.env.API_URL,
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your route files
};

export default swaggerJsdoc(options);
