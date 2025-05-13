// Controllers/EventControllers.js
import Event from "../Model/EventModel.js";
import mongoose from 'mongoose';

// Helper for error responses
const handleError = (res, err, message = "Server error", statusCode = 500) => {
    console.error(message, err);
    if (err && err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", errors: err.errors });
    }
    return res.status(statusCode).json({ message });
};

// Get all events, sorted by date
export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 }); // Sort ascending by date
        res.status(200).json({ events });
    } catch (err) {
        handleError(res, err, "Error fetching events");
    }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID format" });
    }
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ event });
    } catch (err) {
        handleError(res, err, `Error fetching event ${id}`);
    }
};

// Create a new event
export const createEvent = async (req, res) => {
    // Add imageUrl if handling file uploads
    const { title, description, date, time, location, imageUrl } = req.body;
    if (!title || !description || !date || !location) {
        return res.status(400).json({ message: "Missing required fields (title, description, date, location)" });
    }
    try {
        const newEvent = new Event({ title, description, date, time, location, imageUrl });
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (err) {
        handleError(res, err, "Error creating event");
    }
};

// Update an existing event
export const updateEvent = async (req, res) => {
    const { id } = req.params;
    // Add imageUrl if handling file uploads
    const { title, description, date, time, location, imageUrl } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID format" });
    }
    if (!title || !description || !date || !location) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            { title, description, date, time, location, imageUrl },
            { new: true, runValidators: true } // Return updated doc, run schema validation
        );
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found for update" });
        }
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
    } catch (err) {
        handleError(res, err, `Error updating event ${id}`);
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid event ID format" });
    }
    try {
        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found for deletion" });
        }
        res.status(200).json({ message: "Event deleted successfully", event: deletedEvent });
    } catch (err) {
        handleError(res, err, `Error deleting event ${id}`);
    }
};
