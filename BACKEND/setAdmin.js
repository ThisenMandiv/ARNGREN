import mongoose from 'mongoose';
import User from './Model/UserModel.js';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/arngren';

async function setUserAsAdmin(email) {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    // Update the user's role to admin
    user.role = 'admin';
    await user.save();

    console.log(`Successfully updated user ${user.name} (${user.email}) to admin role`);
    console.log('User details:', {
      name: user.name,
      email: user.email,
      age: user.age,
      address: user.address,
      role: user.role
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

// Set the user as admin
const userEmail = 'mandivttt@gmail.com';
setUserAsAdmin(userEmail); 