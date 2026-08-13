import express from "express";
import userController from "../controllers/user-controller.js";

const userRouter = express.Router();

/**
 * @openapi
 * /user:
 *   post:
 *     tags: [User]
 *     summary: Register a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - phoneNumber
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               phoneNumber: { type: string }
 *               vehicleMake: { type: string }
 *               plugType: { type: string, enum: [CCS, NACS] }
 *               paymentMethods:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type: { type: string, enum: [CREDIT_CARD, DIGITAL_WALLET] }
 *                     provider: { type: string }
 *               agreedToTerms: { type: boolean }
 *     responses:
 *       201: { description: User registered }
 *       400: { description: Validation error }
 *       409: { description: Email or phone number already registered }
 */
userRouter.route("/").post(userController.registerUser);

export default userRouter;
