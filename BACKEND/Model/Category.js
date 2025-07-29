// Category.js
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: '' }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', CategorySchema);

// Seed categories if not present
export const seedCategories = async () => {
  const categories = [
    'Mobiles',
    'Services',
    'Hobby, Sport & Kids',
    'Property',
    'Home & Garden',
    'Animals',
    'Electronics',
    'Business & Industry',
    'Fashion & Beauty',
    'Vehicles',
    'Jobs',
    'Education'
  ];
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(categories.map(name => ({ name })));
    console.log('Categories seeded');
  }
};

export default Category; 