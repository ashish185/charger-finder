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
    components: {
      schemas: {
        StationSummary: {
          type: "object",
          properties: {
            stationId: {
              type: "string",
              example: "6a75f01a440d1688108bb0ed",
            },
            name: { type: "string", example: "GreenVolt - Andheri West" },
            address: { type: "string" },
            location: {
              type: "object",
              properties: {
                lat: { type: "number", example: 19.1358 },
                lng: { type: "number", example: 72.8296 },
              },
            },
            amenities: { type: "array", items: { type: "string" } },
            status: { type: "string", example: "live" },
            chargerCount: { type: "integer", example: 2 },
          },
        },
        Charger: {
          type: "object",
          properties: {
            chargerId: {
              type: "string",
              example: "6a75f01a440d1688108bb0ef",
            },
            stationId: {
              type: "string",
              example: "6a75f01a440d1688108bb0ed",
            },
            connectorType: { type: "string", example: "Type2" },
            maxPowerKw: { type: "number", example: 7.4 },
            pricePerKwh: { type: "number", example: 18.5 },
            status: { type: "string", example: "AVAILABLE" },
          },
        },
        ChargerInput: {
          type: "object",
          required: ["connectorType", "maxPowerKw", "pricePerKwh"],
          properties: {
            connectorType: { type: "string", example: "Type2_AC" },
            maxPowerKw: { type: "number", example: 7.4 },
            vehicleCompatibility: {
              type: "array",
              items: { type: "string" },
            },
            pricePerKwh: { type: "number", example: 18.5 },
            pricePerMinute: { type: "number", nullable: true },
          },
        },
      },
      parameters: {
        StationId: {
          name: "stationId",
          in: "path",
          required: true,
          description: "MongoDB station identifier.",
          schema: {
            type: "string",
          },
        },
        ChargerId: {
          name: "chargerId",
          in: "path",
          required: true,
          description: "MongoDB charger identifier.",
          schema: {
            type: "string",
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"], // Path to your route files
};

export default swaggerJsdoc(options);
