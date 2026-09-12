import express from "express";
import operatorStationController from "../controllers/operator-station-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants.js";

const operatorStationsRouter = express.Router();
const requireOperator = [requireAuth, requireRole(ROLES.OPERATOR)];

/**
 * @openapi
 * /operator/stations:
 *   post:
 *     tags: [Operator Stations]
 *     summary: Create a station owned by the authenticated operator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, address, location, operatingHours]
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               location:
 *                 type: object
 *                 properties:
 *                   lat: { type: number }
 *                   lng: { type: number }
 *               amenities: { type: array, items: { type: string } }
 *               occupancy: { type: array, items: { type: string } }
 *               operatingHours:
 *                 type: string
 *                 description: "HH:mm-HH:mm"
 *               status: { type: string, enum: [open, closed, fully_booked] }
 *             example:
 *               name: "GreenVolt - Andheri West"
 *               address: "Link Road, Andheri West, Mumbai, MH 400058"
 *               location: { lat: 19.1358, lng: 72.8296 }
 *               amenities: ["Parking", "Restroom", "Cafe"]
 *               occupancy: ["two_wheeler_scooter", "four_wheeler_hatchback"]
 *               operatingHours: "06:00-23:00"
 *               status: "open"
 *     responses:
 *       201:
 *         description: Station created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 stationId: "6a8059124795ed4ab64947c3"
 *                 name: "GreenVolt - Andheri West"
 *                 address: "Link Road, Andheri West, Mumbai, MH 400058"
 *                 location: { lat: 19.1358, lng: 72.8296 }
 *                 amenities: ["Parking", "Restroom", "Cafe"]
 *                 occupancy: ["two_wheeler_scooter", "four_wheeler_hatchback"]
 *                 operatingHours: "06:00-23:00"
 *                 status: "open"
 *                 chargerCount: 0
 *       400: { description: Validation error. }
 *       403: { description: Authenticated user does not have the operator role. }
 *   get:
 *     tags: [Operator Stations]
 *     summary: List the authenticated operator's stations.
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *     responses:
 *       200:
 *         description: Station portfolio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 stations:
 *                   - stationId: "6a8059124795ed4ab64947c3"
 *                     name: "GreenVolt - Andheri West"
 *                     address: "Link Road, Andheri West, Mumbai, MH 400058"
 *                     location: { lat: 19.1358, lng: 72.8296 }
 *                     amenities: ["Parking", "Restroom", "Cafe"]
 *                     occupancy: ["two_wheeler_scooter", "four_wheeler_hatchback"]
 *                     operatingHours: "06:00-23:00"
 *                     status: "open"
 *                     chargerCount: 1
 *                 pagination: { page: 1, limit: 20, total: 1 }
 */
operatorStationsRouter
  .route("/")
  .post(requireOperator, operatorStationController.createStation)
  .get(requireOperator, operatorStationController.listStations);

/**
 * @openapi
 * /operator/stations/{stationId}:
 *   get:
 *     tags: [Operator Stations]
 *     summary: Get an owned station and its chargers.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *     responses:
 *       200:
 *         description: Station detail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 stationId: "6a8059124795ed4ab64947c3"
 *                 name: "GreenVolt - Andheri West"
 *                 address: "Link Road, Andheri West, Mumbai, MH 400058"
 *                 location: { lat: 19.1358, lng: 72.8296 }
 *                 amenities: ["Parking", "Restroom", "Cafe"]
 *                 occupancy: ["two_wheeler_scooter", "four_wheeler_hatchback"]
 *                 operatingHours: "06:00-23:00"
 *                 status: "open"
 *                 chargerCount: 1
 *                 chargers:
 *                   - chargerId: "6a8059124795ed4ab64947c6"
 *                     stationId: "6a8059124795ed4ab64947c3"
 *                     connectorType: "CCS2"
 *                     chargingType: "DC"
 *                     maxPowerKw: 50
 *                     pricePerKwh: 22
 *                     status: "AVAILABLE"
 *                     availabilitySlots:
 *                       - slotId: "6a8059124795ed4ab64947cb"
 *                         start: "2026-08-05T07:45:00.000Z"
 *                         end: "2026-08-05T08:30:00.000Z"
 *                         status: "AVAILABLE"
 *                         orderId: null
 *       404: { description: Station not found. }
 */
operatorStationsRouter.get(
  "/:stationId",
  requireOperator,
  operatorStationController.getStation,
);

/**
 * @openapi
 * /operator/stations/{stationId}:
 *   patch:
 *     tags: [Operator Stations]
 *     summary: Update fields on an owned station.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               address: { type: string }
 *               location:
 *                 type: object
 *                 properties:
 *                   lat: { type: number }
 *                   lng: { type: number }
 *               amenities: { type: array, items: { type: string } }
 *               occupancy: { type: array, items: { type: string } }
 *               operatingHours:
 *                 type: string
 *                 description: "HH:mm-HH:mm"
 *               status: { type: string, enum: [open, closed, fully_booked] }
 *             example:
 *               status: "closed"
 *     responses:
 *       200:
 *         description: Station updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 stationId: "6a8059124795ed4ab64947c3"
 *                 name: "GreenVolt - Andheri West"
 *                 address: "Link Road, Andheri West, Mumbai, MH 400058"
 *                 location: { lat: 19.1358, lng: 72.8296 }
 *                 amenities: ["Parking", "Restroom", "Cafe"]
 *                 occupancy: ["two_wheeler_scooter", "four_wheeler_hatchback"]
 *                 operatingHours: "06:00-23:00"
 *                 status: "closed"
 *                 chargerCount: 1
 *       400: { description: Validation error. }
 *       404: { description: Station not found. }
 */
operatorStationsRouter.patch(
  "/:stationId",
  requireOperator,
  operatorStationController.updateStation,
);

/**
 * @openapi
 * /operator/stations/{stationId}/chargers:
 *   post:
 *     tags: [Operator Stations]
 *     summary: Add a charger to an owned station.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [connectorType, chargingType, maxPowerKw, pricePerKwh]
 *             properties:
 *               connectorType: { type: string, enum: ["Type 2", "CCS2"] }
 *               chargingType: { type: string, enum: [AC, DC] }
 *               maxPowerKw: { type: number }
 *               pricePerKwh: { type: number }
 *               availabilitySlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [start, end]
 *                   properties:
 *                     start: { type: string, format: date-time }
 *                     end: { type: string, format: date-time }
 *                     status: { type: string, enum: [AVAILABLE, BOOKED] }
 *             example:
 *               connectorType: "CCS2"
 *               chargingType: "DC"
 *               maxPowerKw: 50
 *               pricePerKwh: 22
 *               availabilitySlots:
 *                 - start: "2026-08-05T07:45:00.000Z"
 *                   end: "2026-08-05T08:30:00.000Z"
 *                   status: "AVAILABLE"
 *     responses:
 *       201:
 *         description: Charger created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 chargerId: "6a8059124795ed4ab64947c6"
 *                 stationId: "6a8059124795ed4ab64947c3"
 *                 connectorType: "CCS2"
 *                 chargingType: "DC"
 *                 maxPowerKw: 50
 *                 pricePerKwh: 22
 *                 status: "AVAILABLE"
 *                 availabilitySlots:
 *                   - slotId: "6a8059124795ed4ab64947cb"
 *                     start: "2026-08-05T07:45:00.000Z"
 *                     end: "2026-08-05T08:30:00.000Z"
 *                     status: "AVAILABLE"
 *                     orderId: null
 *       400: { description: Validation error. }
 *       404: { description: Station not found. }
 */
operatorStationsRouter.post(
  "/:stationId/chargers",
  requireOperator,
  operatorStationController.createCharger,
);

/**
 * @openapi
 * /operator/stations/{stationId}/chargers/{chargerId}:
 *   patch:
 *     tags: [Operator Stations]
 *     summary: Update a charger on an owned station.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *       - $ref: "#/components/parameters/ChargerId"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               connectorType: { type: string, enum: ["Type 2", "CCS2"] }
 *               chargingType: { type: string, enum: [AC, DC] }
 *               maxPowerKw: { type: number }
 *               pricePerKwh: { type: number }
 *               availabilitySlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [start, end]
 *                   properties:
 *                     start: { type: string, format: date-time }
 *                     end: { type: string, format: date-time }
 *                     status: { type: string, enum: [AVAILABLE, BOOKED] }
 *             example:
 *               pricePerKwh: 24
 *     responses:
 *       200:
 *         description: Charger updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *             example:
 *               success: true
 *               data:
 *                 chargerId: "6a8059124795ed4ab64947c6"
 *                 stationId: "6a8059124795ed4ab64947c3"
 *                 connectorType: "CCS2"
 *                 chargingType: "DC"
 *                 maxPowerKw: 50
 *                 pricePerKwh: 24
 *                 status: "AVAILABLE"
 *                 availabilitySlots:
 *                   - slotId: "6a8059124795ed4ab64947cb"
 *                     start: "2026-08-05T07:45:00.000Z"
 *                     end: "2026-08-05T08:30:00.000Z"
 *                     status: "AVAILABLE"
 *                     orderId: null
 *       400: { description: Validation error. }
 *       404: { description: Station or charger not found. }
 */
operatorStationsRouter.patch(
  "/:stationId/chargers/:chargerId",
  requireOperator,
  operatorStationController.updateCharger,
);

export default operatorStationsRouter;
