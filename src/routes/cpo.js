import express from "express";
import cpoController from "../controllers/cpo-controller.js";

const cpoRouter = express.Router();

/**
 * @openapi
 * /cpo:
 *   post:
 *     tags: [CPO]
 *     summary: Register a new CPO (Charge Point Operator).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - fullName
 *               - gstNumber
 *               - phoneNumber
 *               - agreedToTerms
 *             properties:
 *               businessName: { type: string }
 *               fullName: { type: string }
 *               gstNumber: { type: string }
 *               phoneNumber: { type: string }
 *               agreedToTerms: { type: boolean }
 *     responses:
 *       201: { description: CPO registered }
 *       400: { description: Validation error }
 *       409: { description: GST/Tax ID or phone number already registered }
 */
cpoRouter.route("/").post(cpoController.registerCpo);

export default cpoRouter;
