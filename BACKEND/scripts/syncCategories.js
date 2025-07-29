import mongoose from 'mongoose';
import Category from '../Model/Category.js';

const MONGODB_URI = 'mongodb+srv://admin:T1FFEeDhOqBFtNy6@cluster0.hsiw6.mongodb.net/'

const categories = [
  {
    name: 'Vehicles & Transport',
    subcategories: [
      'ATV (el.)', 'Car, el-car', 'el-Scooter & Car', 'el-Sykle-1, 2', 'Fatbike-el', 'GoKart-Pedal, el', 'Golf cars (m/skille)', 'Moped-el', 'Motorcycle-Mini', 'Bicycle-el, 1, 2'
    ]
  },
  {
    name: 'Toys & Hobbies',
    subcategories: [
      'Hobby & RC', 'Hoverpod', 'Rocket-Fly', 'RC Products', 'Figures'
    ]
  },
  {
    name: 'Electronics & Gadgets',
    subcategories: [
      'Aquarium', 'Alarm', 'Alkotester', 'Photo Tiles', 'Digital-Certain', 'Disko-Lys', 'DVD-Player', 'Translator', 'Charger-230Vaq', 'Robots', 'Robot-Stilsandsvug', 'Solcellr'
    ]
  },
  {
    name: 'Home & Entertainment',
    subcategories: [
      'Billiards table M/b', 'Electronics & Bab', 'HP-Mtolaughs (Bill', 'TV-Ur & Armb. Ur', 'Star-heaven'
    ]
  },
  {
    name: 'Fun & Miscellaneous',
    subcategories: [
      'Air-joke', 'Listen', 'Converter', 'Compass (Bill/Bike)', 'Snow Shares', 'Train track (to PC)', 'Walkie Talk'
    ]
  }
];

async function syncCategories() {
  await mongoose.connect(MONGODB_URI);
  await Category.deleteMany({});
  await Category.insertMany(categories);
  console.log('Categories synced!');
  await mongoose.disconnect();
}

syncCategories().catch(err => {
  console.error(err);
  process.exit(1);
}); 