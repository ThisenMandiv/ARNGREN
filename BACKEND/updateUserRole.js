import mongoose from 'mongoose';
import User from './Model/UserModel.js';

// Connect to MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/arngren';

async function updateUserRole() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    // Find the user by email
    const userEmail = 'mandivttt@gmail.com';
    const user = await User.findOne({ email: userEmail.toLowerCase() });
    
    if (!user) {
      console.log(`User with email ${userEmail} not found`);
      return;
    }

    console.log('Found user:', {
      name: user.name,
      email: user.email,
      currentRole: user.role
    });

    // Update the user's role to admin
    user.role = 'admin';
    await user.save();

    console.log('✅ Successfully updated user role to admin!');
    console.log('Updated user details:', {
      name: user.name,
      email: user.email,
      role: user.role,
      age: user.age,
      address: user.address
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Make sure MongoDB is running on localhost:27017');
    }
  } finally {
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
}

updateUserRole(); 