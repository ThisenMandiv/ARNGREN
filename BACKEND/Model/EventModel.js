// models/EventModel.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters'] // Longer description allowed
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
    },
    time: { // Optional: Add time field
        type: String,
        trim: true,
        maxlength: [50, 'Time cannot exceed 50 characters']
    },
    location: {
        type: String,
        required: [true, 'Event location is required'],
        trim: true,
        maxlength: [150, 'Location cannot exceed 150 characters']
    },
    imageUrl: { // Optional image for the event
        type: String,
        trim: true,
        default: '' // Or a default event image path
    },
    // You could add more fields like 'category', 'organizer', 'registrationLink' etc.
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Event = mongoose.model("Event", eventSchema);
export default Event;
