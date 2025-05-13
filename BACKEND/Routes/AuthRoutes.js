// Routes/AuthRoutes.js
import express from "express";
import * as authController from "../Controllers/AuthController.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", authController.registerUser);

// POST /api/auth/login
router.post("/login", authController.loginUser);

// Optional: Add routes for password reset, email verification etc. later

export default router;
