// routes/stations.js: Public station discovery endpoints.
import express from "express";
import stationController from "../controllers/station-controller.js";

const stationsRouter = express.Router();

/**
 * @openapi
 * /stations/nearby:
 *   get:
 *     tags:
 *       - Stations
 *     summary: Find nearby stations with available charger counts.
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: lng
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: radiusKm
 *         in: query
 *         required: false
 *         schema:
 *           type: number
 *       - name: connectorType
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["Type 2", CCS2]
 *       - name: chargingType
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [AC, DC]
 *       - name: chargerStatus
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [AVAILABLE, IN_USE, UNAVAILABLE]
 *       - name: occupancy
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum:
 *               [
 *                 two_wheeler_scooter,
 *                 two_wheeler_motorcycle,
 *                 three_wheeler,
 *                 four_wheeler_hatchback,
 *                 four_wheeler_sedan,
 *                 four_wheeler_suv,
 *               ]
 *     responses:
 *       200:
 *         description: Nearby stations with available charger counts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400: { description: Validation error }
 */
stationsRouter.get("/nearby", stationController.findNearbyStations);

/**
 * @openapi
 * /stations/{stationId}/chargers:
 *   get:
 *     tags:
 *       - Stations
 *     summary: List chargers (with pricing) available at a station.
 *     parameters:
 *       - name: stationId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chargers available at the station.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400: { description: Validation error }
 *       404: { description: Station not found }
 */
stationsRouter.get("/:stationId/chargers", stationController.getStationCharges);

export default stationsRouter;
