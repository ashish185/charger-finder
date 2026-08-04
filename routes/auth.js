import express from "express";
import { validateSignUpData } from "../utils/validation.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getTokenFromRequest, requireAuth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Validation of data
    const validationErrors = validateSignUpData(req);
    if (validationErrors) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: validationErrors,
        },
      });
    }

    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //   Creating a new instance of the User model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout Successful!!");
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();
      const fiveMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
      res.cookie("token", token, {
        expires: new Date(Date.now() + fiveMinutes),
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.json({
        data: {
          id: user._id,
          name: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`.trim(),
          emailId: user.emailId,
        },
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

authRouter.get("/profile", requireAuth, async (req, res) => {
  try {
    const existingToken = getTokenFromRequest(req);
    if (existingToken) {
      try {
        const payload = jwt.verify(existingToken, process.env.JWT_SECRET);
        const existingUser = await User.findById(payload._id);
        if (existingUser) {
          return res.json({
            data: {
              id: existingUser._id,
              name: `${existingUser.firstName}${existingUser.lastName ? ` ${existingUser.lastName}` : ""}`.trim(),
              emailId: existingUser.emailId,
            },
          });
        }
      } catch (ignored) {
        // invalid token, continue with normal login flow
      }
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error fetching profile", error: err.message });
  }
});

export default authRouter;
