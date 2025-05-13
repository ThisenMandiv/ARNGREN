import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming a User model exists
        required: true,
    },
    subject: {
        type: String,
        required: true,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        maxLength: 500,
    },
    category: {
        type: String,
        enum: ['Promotion', 'Discount', 'Order', 'Product', 'Other'],
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'InProgress', 'Resolved'],
        default: 'Open',
    },
    comments: [{
        text: String,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    attachments: [{
        url: String,
        fileName: String,
    }],
    adminResponse: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Update `updatedAt` on save
TicketSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('Ticket', TicketSchema);