// Ad.js
import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: false },
  category: { type: String, required: true },
  location: { type: String, required: false },
  images: [{ type: String }],
  contactInfo: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});

const Ad = mongoose.model('Ad', AdSchema);
export default Ad; 