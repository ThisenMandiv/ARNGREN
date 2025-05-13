// Routes/BlogPostRoutes.js
import express from "express";
import mongoose from 'mongoose';
import * as blogPostController from "../Controllers/BlogPostControllers.js";
// const multer = require('multer'); // <<< REMOVE multer import
// const path = require('path');   // <<< REMOVE path import
// const fs = require('fs');       // <<< REMOVE fs import

// --- REMOVE Multer Configuration ---
// const blogUploadDir = ...
// const blogStorage = ...
// const fileFilter = ...
// const uploadBlogImage = ...
// const handleBlogUpload = ...
// --- End REMOVE Multer Configuration ---

const router = express.Router();

// Middleware to validate ObjectId (keep existing or simplify if needed)
const validateObjectId = (req, res, next) => {
    const id = req.params.id || req.params.identifier;
    const isUpdateOrDelete = req.method === 'PUT' || req.method === 'DELETE';
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
        if (isUpdateOrDelete) {
             return res.status(400).json({ message: 'Invalid ID format specified for update/delete' });
        }
        if (req.method === 'GET') { return next(); } // Allow slugs for GET
         return res.status(400).json({ message: 'Invalid ID format specified' });
    }
    next();
};

// --- Routes ---
router.get("/", blogPostController.getAllBlogPosts);

// POST without multer middleware
router.post("/", blogPostController.createBlogPost); // <<< REMOVE handleBlogUpload

router.get("/:identifier", validateObjectId, blogPostController.getBlogPostByIdOrSlug);

// PUT without multer middleware
router.put("/:id", validateObjectId, blogPostController.updateBlogPost); // <<< REMOVE handleBlogUpload

router.delete("/:id", validateObjectId, blogPostController.deleteBlogPost);

export default router;
