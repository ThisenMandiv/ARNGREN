// Controllers/AuthController.js
import User from "../Model/UserModel.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

// Enhanced error handler (similar to other controllers)
const handleError = (res, err, contextMessage = "Auth error", statusCode = 500) => {
    console.error(`Error in ${contextMessage}:`, err.message);
    if (err && err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ message: "Validation Error", errors: errors });
    }
    if (err && err.code === 11000) { // Handle duplicate email error
        return res.status(400).json({ message: `Registration failed: Email '${err.keyValue.email}' already exists.` });
    }
    return res.status(statusCode).json({ message: `${contextMessage}: An unexpected error occurred.` });
};

// --- User Registration ---
export const registerUser = async (req, res) => {
    // Extract necessary fields (password will be hashed by pre-save hook)
    const { name, age, address, email, password, role } = req.body; // Include role if allowing admin creation

    // Basic validation (Mongoose schema handles more)
    if (!name || !age || !address || !email || !password) {
        return res.status(400).json({ message: "Please provide name, age, address, email, and password." });
    }
     // Add specific password validation checks here if desired (e.g., length, uppercase)
     // before sending to model, although hashing is the main security.
     if (password.length < 8) {
         return res.status(400).json({ message: "Password must be at least 8 characters long." });
     }

    try {
        console.log(`Attempting registration for email: ${email}`);
        // Check if user already exists (optional, but good practice)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            console.warn(`Registration attempt failed: Email ${email} already exists.`);
            return res.status(400).json({ message: "Email address already registered." });
        }

        // Create new user (password hashing happens in pre-save hook)
        const newUser = new User({
            name,
            age: Number(age), // Ensure age is a number
            address,
            email: email.toLowerCase(), // Store email consistently
            password,
            role: role === 'admin' ? 'admin' : 'user' // Assign role safely, default to user
        });

        await newUser.save(); // Save the user (triggers hashing)
        console.log(`User registered successfully: ${email}`);

        // Don't send password back, even hashed
        const userResponse = newUser.toObject(); // Convert to plain object
        delete userResponse.password; // Remove password property

        // In a real app, you might automatically log them in and send a JWT token here
        res.status(201).json({ message: "Registration successful!", user: userResponse });

    } catch (err) {
        handleError(res, err, "registerUser");
    }
};

// --- User Login ---
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password." });
    }

    try {
        console.log(`Login attempt for email: ${email}`);
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            console.warn(`Login failed: User not found for email ${email}`);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            console.warn(`Login failed: Incorrect password for email ${email}`);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        console.log(`Login successful for email: ${email}`);

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role,
                email: user.email,
                superAdmin: user.superAdmin
            },
            process.env.JWT_SECRET || 'your-secret-key', // Fallback for development
            { expiresIn: '24h' }
        );

        // Prepare user data to send back (exclude password)
        const userResponse = user.toObject();
        delete userResponse.password;

        // Send back success message, token, and user info
        res.status(200).json({
            message: "Login successful!",
            token: token,
            user: userResponse
        });

    } catch (err) {
        console.error('Login error:', err);
        handleError(res, err, "loginUser");
    }
};

// --- Update User Profile ---
export const updateProfile = async (req, res) => {
    const { name, age, address } = req.body;
    const userId = req.user._id; // From user object set by auth middleware

    if (!name && !age && !address) {
        return res.status(400).json({ message: "Please provide at least one field to update." });
    }

    try {
        console.log(`Updating profile for user: ${userId}`);
        
        // Construct update object with only provided fields
        const updateData = {};
        if (name) updateData.name = name;
        if (age) updateData.age = Number(age);
        if (address) updateData.address = address;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found." });
        }

        console.log(`Profile updated successfully for user: ${userId}`);
        res.status(200).json({ 
            message: "Profile updated successfully!", 
            user: updatedUser 
        });

    } catch (err) {
        handleError(res, err, "updateProfile");
    }
};
