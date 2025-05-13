import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    validUntil: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

// Prevent model overwrite upon repeated import
export default mongoose.models.Discount || mongoose.model('Discount', DiscountSchema); 