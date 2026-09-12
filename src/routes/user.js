import express from "express";
import userController from "../controllers/user-controller.js";
import { requireAuth } from "../middleware/auth.js";

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

/**
 * @openapi
 * /user/me:
 *   get:
 *     tags: [User]
 *     summary: Get the currently logged-in user.
 *     responses:
 *       200:
 *         description: User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       401: { description: No token provided or invalid/expired token }
 *       404: { description: User not found }
 */
userRouter.route("/me").get(requireAuth, userController.getCurrentUser);

/**
 * @openapi
 * /user/me:
 *   patch:
 *     tags: [User]
 *     summary: Complete or update the current user's profile.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *             properties:
 *               full_name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *               agreed_to_terms: { type: boolean }
 *     responses:
 *       200:
 *         description: Updated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400: { description: Validation error }
 *       401: { description: No token provided or invalid/expired token }
 *       404: { description: User not found }
 *       409: { description: Email already registered }
 */
userRouter.route("/me").patch(requireAuth, userController.completeProfile);

/**
 * @openapi
 * /user/role:
 *   patch:
 *     tags: [User]
 *     summary: Update the current user's role.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [customer, operator, pricing_manager]
 *     responses:
 *       200:
 *         description: Updated user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       400: { description: Validation error }
 *       401: { description: No token provided or invalid/expired token }
 *       404: { description: User not found }
 */
userRouter.route("/role").patch(requireAuth, userController.updateRole);

/**
 * @openapi
 * /user/{identifier}:
 *   get:
 *     tags: [User]
 *     summary: Get a user by id or phone number.
 *     parameters:
 *       - name: identifier
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User id or phone number.
 *     responses:
 *       200:
 *         description: User.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data: { type: object }
 *       404: { description: User not found }
 */
userRouter.route("/:identifier").get(requireAuth, userController.getUser);

export default userRouter;
