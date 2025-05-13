import mongoose from 'mongoose';

const PromotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    status: { type: String, enum: ['Active', 'Expired', 'Upcoming'], default: 'Active' },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Promotion', PromotionSchema);