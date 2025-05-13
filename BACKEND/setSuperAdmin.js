import mongoose from 'mongoose';
import User from './Model/UserModel.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI;

async function setSuperAdmin() {
  if (!MONGO_URI) {
    console.error('MONGO_URI not set in environment.');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI);
  const result = await User.updateOne(
    { email: 'mandivt@gmail.com' },
    { $set: { superAdmin: true } }
  );
  if (result.modifiedCount > 0) {
    console.log('Super admin set successfully!');
  } else {
    console.log('No user updated. Check if the email is correct.');
  }
  await mongoose.disconnect();
}

setSuperAdmin(); 