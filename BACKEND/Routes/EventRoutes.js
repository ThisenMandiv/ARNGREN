// Routes/EventRoutes.js
import express from "express";
import mongoose from 'mongoose';
import * as eventController from "../Controllers/EventControllers.js";
// const multer = require('multer'); // <<< REMOVE multer import
// const path = require('path');   // <<< REMOVE path import
// const fs = require('fs');       // <<< REMOVE fs import

// --- REMOVE Multer Configuration ---
// const eventUploadDir = ...
// const eventStorage = ...
// const fileFilter = ...
// const uploadEventImage = ...
// const handleEventUpload = ...
// --- End REMOVE Multer Configuration ---


// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format specified' });
    }
    next();
};

const router = express.Router();

// --- Routes ---
router.get("/", eventController.getAllEvents);

// POST without multer middleware
router.post("/", eventController.createEvent); // <<< REMOVE handleEventUpload

router.get("/:id", validateObjectId, eventController.getEventById);

// PUT without multer middleware
router.put("/:id", validateObjectId, eventController.updateEvent); // <<< REMOVE handleEventUpload

router.delete("/:id", validateObjectId, eventController.deleteEvent);

export default router;
