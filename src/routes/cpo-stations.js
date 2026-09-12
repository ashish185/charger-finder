import express from "express";
import stationController from "../controllers/station-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants.js";

const stationsRouter = express.Router();
const requireOperator = [requireAuth, requireRole(ROLES.ADMIN, ROLES.OPERATOR)];

/**
 * @openapi
 * /cpo/stations:
 *   post:
 *     tags: [Cpo Stations]
 *     summary: Create a station owned by the authenticated cpo.
 *     responses:
 *       201: { description: Station created }
 *   get:
 *     tags: [Cpo Stations]
 *     summary: List the authenticated cpo's stations.
 *     parameters:
 *       - { name: status, in: query, schema: { type: string } }
 *       - { name: city, in: query, schema: { type: string } }
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     stations:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/StationSummary"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 20 }
 *                         total: { type: integer, example: 2 }
 */
stationsRouter
  .route("/")
  .post(requireOperator, stationController.createStation)
  .get(requireOperator, stationController.listStations);

/**
 * @openapi
 * /cpo/stations/{stationId}:
 *   get:
 *     tags: [Cpo Stations]
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
 *                 data:
 *                   allOf:
 *                     - $ref: "#/components/schemas/StationSummary"
 *                     - type: object
 *                       properties:
 *                         chargers:
 *                           type: array
 *                           items:
 *                             $ref: "#/components/schemas/Charger"
 *       404: { description: Station not found }
 *   put:
 *     tags: [Cpo Stations]
 *     summary: Update station metadata.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *   patch:
 *     tags: [Cpo Stations]
 *     summary: Partially update station metadata.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 *   delete:
 *     tags: [Cpo Stations]
 *     summary: Soft-delete a station by setting its status to delisted.
 *     parameters:
 *       - $ref: "#/components/parameters/StationId"
 */
stationsRouter
  .route("/:stationId")
  .get(requireOperator, stationController.getStation)
  .put(requireOperator, stationController.updateStation)
  .patch(requireOperator, stationController.updateStation)
  .delete(requireOperator, stationController.deleteStation);

stationsRouter.post(
  "/:stationId/chargers",
  requireOperator,
  stationController.createCharger,
);
stationsRouter.put(
  "/:stationId/chargers/:chargerId",
  requireOperator,
  stationController.updateCharger,
);
stationsRouter.delete(
  "/:stationId/chargers/:chargerId",
  requireOperator,
  stationController.deleteCharger,
);
stationsRouter.put(
  "/:stationId/chargers/:chargerId/pricing",
  requireOperator,
  stationController.updatePricing,
);
stationsRouter.put(
  "/:stationId/operating-hours",
  requireOperator,
  stationController.updateOperatingHours,
);
stationsRouter.put(
  "/:stationId/amenities",
  requireOperator,
  stationController.updateAmenities,
);

export default stationsRouter;
