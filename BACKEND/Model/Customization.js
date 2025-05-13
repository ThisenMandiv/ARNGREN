import mongoose from 'mongoose';

const customizationSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  material: { type: String, required: true },
  size: { type: String, required: true },
  theme: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  userId: { type: String }, 
  userName: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Customization', customizationSchema);