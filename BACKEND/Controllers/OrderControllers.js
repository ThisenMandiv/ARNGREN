// Controllers/OrderControllers.js
import Order from "../Model/OrderModel.js";
import { sendStatusUpdateEmail } from '../services/emailService.js';
import mongoose from 'mongoose';

// --- Get all orders (No change needed) ---
export const getAllOrders = async (req, res) => {
    let orders;
    try {
        orders = await Order.find().sort({ date: -1 }); // Sort by date descending
    } catch (err) {
        console.error("Error fetching orders:", err);
        return res.status(500).json({ message: "Server error fetching orders" });
    }
    return res.status(200).json({ orders });
};

// --- Add a new order (Add default status) ---
export const addOrders = async (req, res, next) => {
    const { userName, product, quantity, deliveryAddress, date } = req.body;

    // Basic validation
    if (!userName || !product || !quantity || !deliveryAddress || !date) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    let newOrder;
    try {
        newOrder = new Order({
            userName,
            product,
            quantity: Number(quantity),
            deliveryAddress,
            date,
            status: "Pending" // Set default status
        });
        await newOrder.save();
    } catch (err) {
        console.error("Error adding order:", err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        return res.status(500).json({ message: "Unable to add order" });
    }
    return res.status(201).json({ order: newOrder }); // Return 201 Created
};

// --- Get order by ID (No change needed) ---
export const getById = async (req, res, next) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }
    let order;
    try {
        order = await Order.findById(id);
    } catch (err) {
        console.error(`Error fetching order by ID ${id}:`, err);
        return res.status(500).json({ message: "Server error fetching order" });
    }
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ order });
};

// --- Update FULL order details (Keep original, but add status) ---
export const updateOrder = async (req, res, next) => {
    const id = req.params.id;
     // Include status in the destructuring
    const { userName, product, quantity, deliveryAddress, date, status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }

    let updatedOrder;
    try {
        // Find and update the order
        updatedOrder = await Order.findByIdAndUpdate(id, {
            userName,
            product,
            quantity: Number(quantity),
            deliveryAddress,
            date,
            status // Update status along with other fields
        }, { new: true, runValidators: true }); // Options: return updated doc, run schema validators

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found for update" });
        }
        // Optionally: Send email if status changed during a full update? Decide based on workflow.
        // await sendStatusUpdateEmail(updatedOrder);

    } catch (err) {
        console.error(`Error updating order ${id}:`, err);
         if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        return res.status(500).json({ message: "Unable to update order details" });
    }
    return res.status(200).json({ order: updatedOrder });
};


// --- NEW: Update ONLY order status and send email ---
export const updateOrderStatus = async (req, res, next) => {
    const id = req.params.id;
    const { status } = req.body; // Only expect status in the body

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }

    if (!status || !['Pending', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
         return res.status(400).json({ message: "Invalid status provided" });
    }

    let order;
    try {
        order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found for status update" });
        }

        // Only update and send email if status actually changes
        if (order.status !== status) {
            order.status = status;
            await order.save(); // Save the updated order
            await sendStatusUpdateEmail(order); // Send email AFTER successful save
        }

    } catch (err) {
        console.error(`Error updating order status for ${id}:`, err);
         if (err.name === 'ValidationError') {
            return res.status(400).json({ message: "Validation Error", errors: err.errors });
        }
        return res.status(500).json({ message: "Unable to update order status" });
    }
    return res.status(200).json({ message: "Order status updated successfully", order });
};


// --- Delete order (No change needed) ---
export const deleteOrder = async (req, res, next) => {
    const id = req.params.id;
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }
    let order;
    try {
        order = await Order.findByIdAndDelete(id);
    } catch (err) {
        console.error(`Error deleting order ${id}:`, err);
        return res.status(500).json({ message: "Server error deleting order" });
    }
    if (!order) {
        // Even if not found, deletion is idempotent, maybe return 200 or 204
        return res.status(404).json({ message: "Order not found for deletion" });
    }
    return res.status(200).json({ message: "Order deleted successfully", order }); // Return deleted order info
};
