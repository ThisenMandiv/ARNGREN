// Routes/UserRoutes.js
import express from "express";
import mongoose from 'mongoose';
import * as userController from "../Controllers/UserController.js"; // Use updated controller
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to validate ObjectId for routes with :id
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format specified' });
    }
    next();
};

// --- Routes for Admin User Management ---
// Optional: Add authentication/authorization middleware here later to ensure only admins access these

// GET all users
router.get("/", userController.getAllUsers);

// GET a specific user by ID
router.get("/:id", validateObjectId, userController.getById);

// PUT (update) a specific user
router.put("/:id", validateObjectId, userController.updateUser);

// DELETE a specific user
router.delete("/:id", requireAuth, validateObjectId, userController.deleteUser);

// POST route to set user as admin
router.post("/set-admin", userController.setUserAsAdmin);

// POST route for adding users is removed - use POST /api/auth/register instead

export default router;
// This file is now focused on user management for admins, while authentication is handled separately in AuthRoutes.js
// and the user model is consolidated in UserModel.js. This keeps the code modular and easier to maintain.