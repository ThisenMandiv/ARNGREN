// Routes/ContactRoutes.js
import express from "express";
import * as contactController from "../Controllers/ContactControllers.js";

const router = express.Router();

// POST route to handle form submission
router.post("/", contactController.submitContactForm);

export default router;
