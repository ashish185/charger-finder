/* eslint-disable no-undef */
// routes/chargers.js: Charger discovery, details, and estimate endpoints.
import express from "express";
import chargerController from "../controllers/charger-controller.js";
import reviewController from "../controllers/review-controller.js";

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
 *       - name: slotId
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

/**
 * @openapi
 * /chargers/{chargerId}/availability-slots:
 *   get:
 *     tags:
 *       - Chargers
 *     summary: Get availability slots for a charger.
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of availability slots.
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
 *       404: { description: Charger not found. }
 */
chargersRouter.get(
  "/:chargerId/availability-slots",
  chargerController.getChargerAvailabilitySlots,
);

/**
 * @openapi
 * /chargers/{chargerId}/reviews:
 *   get:
 *     tags:
 *       - Chargers
 *     summary: List reviews for a charger (paginated).
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *     responses:
 *       200:
 *         description: Paginated list of reviews.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 20 }
 *                         total: { type: integer, example: 8 }
 *       404: { description: Charger not found. }
 */
chargersRouter.get("/:chargerId/reviews", reviewController.listChargerReviews);

export default chargersRouter;
