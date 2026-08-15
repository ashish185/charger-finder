import express from "express";
import pricingController from "../controllers/pricing-controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { ROLES } from "../constants.js";

const pricingRouter = express.Router();

/**
 * @openapi
 * /cpo/chargers/{chargerId}/pricing:
 *   get:
 *     tags: [Pricing]
 *     summary: Get the active pricing config for a charger owned by the authenticated cpo.
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pricing config.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       404: { description: Charger or pricing not found. }
 *   put:
 *     tags: [Pricing]
 *     summary: Create or update the pricing config for a charger.
 *     parameters:
 *       - name: chargerId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ratePerKwh]
 *             properties:
 *               ratePerKwh: { type: number }
 *               reservationFee: { type: number }
 *               platformFee: { type: number }
 *               chargingEfficiency: { type: number }
 *               bufferPercentage: { type: number }
 *               isActive: { type: boolean }
 *     responses:
 *       200:
 *         description: Pricing config saved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400: { description: Validation error. }
 *       404: { description: Charger not found. }
 */
pricingRouter
  .route("/:chargerId/pricing")
  .get(requireAuth, pricingController.getChargerPricing)
  .put(
    requireAuth,
    requireRole(ROLES.ADMIN, ROLES.OPERATOR),
    pricingController.upsertChargerPricing,
  );

export default pricingRouter;
