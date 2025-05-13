import { default as mongoose } from 'mongoose';

const DiscountSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    percentage: { type: Number, required: true, min: 0, max: 100 },
    validUntil: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    // Array of user IDs (ObjectId) who are allowed to use this discount. Empty or missing means public.
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.model('Discount', DiscountSchema);