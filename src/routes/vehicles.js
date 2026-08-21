import express from "express";
import vehicleController from "../controllers/vehicle-controller.js";
import { requireAuth } from "../middleware/auth.js";

const vehiclesRouter = express.Router();

/**
 * @openapi
 * /vehicles:
 *   post:
 *     tags: [Vehicles]
 *     summary: Add a vehicle to the authenticated user's garage.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [manufacturer, model, vehicleType]
 *             properties:
 *               nickname: { type: string }
 *               manufacturer: { type: string }
 *               model: { type: string }
 *               variant: { type: string }
 *               vehicleType:
 *                 type: string
 *                 enum:
 *                   [
 *                     two_wheeler_scooter,
 *                     two_wheeler_motorcycle,
 *                     three_wheeler,
 *                     four_wheeler_hatchback,
 *                     four_wheeler_sedan,
 *                     four_wheeler_suv,
 *                   ]
 *               registrationNumber: { type: string }
 *               batteryCapacityKwh: { type: number }
 *               chargingOptions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     chargingType: { type: string, enum: [AC, DC] }
 *                     connectorType: { type: string, enum: ["Type 2", CCS2] }
 *               rangeKm: { type: number }
 *               isDefault: { type: boolean }
 *     responses:
 *       201:
 *         description: Vehicle created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400: { description: Validation error. }
 *   get:
 *     tags: [Vehicles]
 *     summary: List vehicles in the authenticated user's garage.
 *     responses:
 *       200:
 *         description: Vehicles.
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
 */
vehiclesRouter
  .route("/")
  .post(vehicleController.createVehicle)
  .get(vehicleController.listVehicles);

/**
 * @openapi
 * /vehicles/{vehicleId}:
 *   get:
 *     tags: [Vehicles]
 *     summary: Get a vehicle owned by the authenticated user.
 *     parameters:
 *       - name: vehicleId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vehicle.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       404: { description: Vehicle not found. }
 */
vehiclesRouter.route("/:vehicleId").get(vehicleController.getVehicle);

export default vehiclesRouter;
