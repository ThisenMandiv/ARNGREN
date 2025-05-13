// Routes/OrderRoutes.js
import express from "express";
import mongoose from 'mongoose'; // Import mongoose for validation
import * as orderController from "../Controllers/OrderControllers.js";

const router = express.Router();

// Middleware to validate ObjectId for routes with :id
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID format specified' });
    }
    next();
};

// GET all orders
router.get("/", orderController.getAllOrders);

// POST a new order
router.post("/", orderController.addOrders);

// GET a specific order by ID
router.get("/:id", validateObjectId, orderController.getById);

// PUT (update) a specific order's full details
router.put("/:id", validateObjectId, orderController.updateOrder);

// PUT (update) ONLY the status of a specific order
router.put("/:id/status", validateObjectId, orderController.updateOrderStatus); // New route for status

// DELETE a specific order by ID
router.delete("/:id", validateObjectId, orderController.deleteOrder);

export default router;
