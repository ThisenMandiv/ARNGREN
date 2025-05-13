// models/UserModel.js
import mongoose from "mongoose";
import bcrypt from 'bcryptjs'; // <<< Import bcrypt

const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [40, 'Name cannot exceed 40 characters']
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [1, 'Age must be a positive number'], // Added minimum age
        validate: {
            validator: Number.isInteger,
            message: 'Age must be an integer'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensure emails are unique
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        // Password validation (e.g., uppercase) is good, but primary security is hashing
        // We won't store plain passwords, so direct validation isn't as useful here.
        // We select: false so password isn't returned by default in queries
        select: false,
    },
    role: { // <<< Add a role field (optional but useful)
        type: String,
        enum: ['user', 'admin'], // Define possible roles
        default: 'user'        // Default role is 'user'
    },
    superAdmin: {
        type: Boolean,
        default: false
    }
    // Add other fields like contactNumber if needed
}, { timestamps: true }); // Adds createdAt and updatedAt

// --- Password Hashing Middleware ---
// Hash password BEFORE saving a new user or updating the password
userSchema.pre('save', async function(next) {
    // Only run this function if password was actually modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        console.log(`Hashing password for user: ${this.email}`);
        // Generate salt & hash password
        const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended
        this.password = await bcrypt.hash(this.password, salt);
        console.log(`Password hashed for user: ${this.email}`);
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        next(error); // Pass error to Mongoose
    }
});

// --- Password Comparison Method ---
// Add a method to the user schema to compare entered password with stored hash
userSchema.methods.comparePassword = async function(enteredPassword) {
    try {
        // 'this.password' refers to the hashed password stored in the document
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        console.error("Error comparing password:", error);
        return false; // Return false on error
    }
};

// Check if the model exists before creating it
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
// This will create a collection named 'users' in MongoDB (lowercase plural by default)