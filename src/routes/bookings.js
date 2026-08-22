/* eslint-disable no-undef */
// routes/bookings.js: Booking creation (Razorpay order) and payment webhook endpoints.
import express from "express";
import bookingController from "../controllers/booking-controller.js";
import { requireAuth } from "../middleware/auth.js";

const bookingsRouter = express.Router();

/**
 * @openapi
 * /bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a booking for a charger slot and start a Razorpay order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [chargerId, slotId]
 *             properties:
 *               chargerId: { type: string }
 *               slotId: { type: string }
 *     responses:
 *       200:
 *         description: Razorpay order created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400: { description: Validation error. }
 *       404: { description: Charger or slot not found. }
 */
bookingsRouter.post("/", requireAuth, bookingController.createBooking);

/**
 * @openapi
 * /bookings/my:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: List the authenticated user's bookings (paginated).
 *     parameters:
 *       - { name: page, in: query, schema: { type: integer, minimum: 1 } }
 *       - { name: limit, in: query, schema: { type: integer, minimum: 1, maximum: 100 } }
 *     responses:
 *       200:
 *         description: Paginated list of the user's bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page: { type: integer, example: 1 }
 *                         limit: { type: integer, example: 20 }
 *                         total: { type: integer, example: 8 }
 */
bookingsRouter.get("/my", requireAuth, bookingController.listMyBookings);

/**
 * @openapi
 * /bookings/webhook:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Razorpay payment webhook. Marks the order and charger slot as booked.
 *     responses:
 *       200:
 *         description: Webhook processed.
 *       400: { description: Invalid webhook signature. }
 */
bookingsRouter.post("/webhook", bookingController.webhook);

export default bookingsRouter;
