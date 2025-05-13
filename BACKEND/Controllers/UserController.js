// Controllers/UserController.js
import User from "../Model/UserModel.js"; // <<< Use the consolidated User model
import mongoose from 'mongoose';

// Enhanced error handler
const handleError = (res, err, contextMessage = "User operation error", statusCode = 500) => {
    console.error(`Error in ${contextMessage}:`, err.message);
    if (err && err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        return res.status(400).json({ message: "Validation Error", errors: errors });
    }
    if (err && err.code === 11000) {
        return res.status(400).json({ message: "Duplicate key error", error: err.keyValue });
    }
    return res.status(statusCode).json({ message: `${contextMessage}: An unexpected error occurred.` });
};

// --- Get all users (Admin only - exclude password) ---
export const getAllUsers = async (req, res, next) => {
    // Optional: Add middleware here later to check if requestor is admin
    try {
        // Exclude password field explicitly using select('-password')
        const users = await User.find().select('-password');
        res.status(200).json({ users });
    } catch (err) {
        handleError(res, err, "getAllUsers");
    }
};

// --- Get user by ID (Admin only - exclude password) ---
export const getById = async (req, res, next) => {
    // Optional: Add admin check middleware
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    try {
        // Exclude password
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (err) {
        handleError(res, err, `getById (${id})`);
    }
};

// --- Update user details (Admin only - DO NOT update password here) ---
// Password updates should have a separate, secure process
export const updateUser = async (req, res, next) => {
    // Optional: Add admin check middleware
    const { id } = req.params;
    // Exclude password from updatable fields here
    const { name, age, address, email, role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Construct update object carefully, excluding password
    const updateData = { name, age: Number(age), address, email: email?.toLowerCase(), role };
    // Remove undefined fields so they don't overwrite existing data unintentionally
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Validate role if provided
    if (role && !['user', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role specified." });
    }

    try {
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found for update" });
        }
        // Prevent other admins from editing the super admin
        if (userToUpdate.superAdmin && (!req.user || req.user._id.toString() !== id)) {
            return res.status(403).json({ message: "Only the super admin can edit their own account." });
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true } // Return updated doc, run validators
        ).select('-password'); // Exclude password from the returned document

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found for update" });
        }
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        handleError(res, err, `updateUser (${id})`);
    }
};

// --- Delete user (Admin only) ---
export const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID format" });
    }
    try {
        const userToDelete = await User.findById(id);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found for deletion" });
        }
        // Debug log
        console.log('req.user:', req.user);
        // Prevent deletion of superAdmin by anyone
        if (userToDelete.superAdmin) {
            return res.status(403).json({ message: "Super admin cannot be deleted." });
        }
        // Only superAdmin can delete admins
        if (userToDelete.role === 'admin') {
            if (!req.user || req.user.superAdmin !== true) {
                return res.status(403).json({ message: "Only the super admin can delete other admins." });
            }
        }
        // Allow deletion of users by any admin
        const deletedUser = await User.findByIdAndDelete(id).select('-password');
        res.status(200).json({ message: "User deleted successfully", user: deletedUser });
    } catch (err) {
        handleError(res, err, `deleteUser (${id})`);
    }
};

// REMOVED addUsers - Registration is handled by AuthController.registerUser
// exports.addUsers = ...
//
// --- Update user password (Admin only) ---