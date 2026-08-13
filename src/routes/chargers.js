/* eslint-disable no-undef */
// routes/chargers.js: Charger discovery, details, and estimate endpoints.
import express from "express";
import ChargerRepository from "../repositories/charger-repository.js";

const chargersRouter = express.Router();

function toArray(value) {
  if (value === undefined) {
    return undefined;
  }
  return Array.isArray(value) ? value : [value];
}

/**
 * @openapi
 * /chargers/nearby:
 *   get:
 *     tags:
 *       - Chargers
 *     summary: Find nearby chargers.
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *       - name: lng
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *       - name: radiusKm
 *         in: query
 *         required: true
 *         schema:
 *           type: number
 *       - name: type
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: [2W, 4W]
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
 *       - name: connector
 *         in: query
 *         required: false
 *         style: form
 *         explode: true
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *             enum: ["Type 2", CCS2]
 *     responses:
 *       200:
 *         description: Nearby chargers list.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
chargersRouter.get("/nearby", async (req, res, next) => {
  try {
    const { lat, lng, radiusKm, type, chargingType, connector } = req.query;

    if (!lat || !lng || !radiusKm) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "lat, lng, and radiusKm are required",
        },
      });
    }

    const nearby = await ChargerRepository.findNearby({
      lat,
      lng,
      radiusKm,
      type: toArray(type),
      chargingType: toArray(chargingType),
      connector: toArray(connector),
    });

    res.json(nearby);
  } catch (err) {
    next(err);
  }
});

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
chargersRouter.get("/:chargerId", async (req, res, next) => {
  try {
    const { chargerId } = req.params;
    const charger = await ChargerRepository.findById(chargerId);

    if (!charger) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Charger not found" },
      });
    }

    res.json({
      chargerId: charger._id,
      stationId: charger.station_id,
      status: charger.status,
      price: charger.price_per_kwh,
      powerKw: charger.max_power_kw,
      eta: charger.status === "IN_USE" ? 5 : 1,
      freshness:
        charger.last_updated_at &&
        charger.last_updated_at > new Date(Date.now() - 1000 * 60 * 30)
          ? "FRESH"
          : "STALE",
    });
  } catch (err) {
    next(err);
  }
});

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
chargersRouter.get("/:chargerId/estimate", async (req, res, next) => {
  try {
    const { chargerId } = req.params;
    const { vehicleId } = req.query;

    if (!vehicleId) {
      return res.status(400).json({
        error: { code: "VALIDATION_ERROR", message: "vehicleId is required" },
      });
    }

    const estimate = await ChargerRepository.estimate(chargerId, vehicleId);

    if (!estimate) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Charger not found" },
      });
    }

    res.json(estimate);
  } catch (err) {
    next(err);
  }
});

export default chargersRouter;
