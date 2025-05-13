import mongoose from 'mongoose';

const CouponCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  validUntil: { type: Date, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // users who can use this coupon
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who created
  createdAt: { type: Date, default: Date.now },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }, // Link to promotion
});

export default mongoose.model('CouponCode', CouponCodeSchema);
