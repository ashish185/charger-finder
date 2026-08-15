/* eslint-disable no-undef */
// routes/chargers.js: Charger discovery, details, and estimate endpoints.
import express from "express";
import chargerController from "../controllers/charger-controller.js";

const chargersRouter = express.Router();

/**
 * @openapi
 * /chargers/{chargerId}:
 *   get:
 *     tags:
 *       - Chargers
 *     summary: Get charger details.
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Charger detail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
chargersRouter.get("/:chargerId", chargerController.getCharger);

/**
 * @openapi
 * /chargers/{chargerId}/estimate:
 *   get:
 *     tags:
 *       - Chargers
 *     summary: Estimate charging cost and timing.
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: vehicleId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cost and duration estimate.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
chargersRouter.get(
  "/:chargerId/estimate",
  chargerController.getChargerEstimate,
);

export default chargersRouter;
