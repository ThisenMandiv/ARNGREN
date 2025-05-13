// Routes/ProductRoutes.js
import express from 'express';
import * as productController from '../Controllers/ProductControllers.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// --- Multer Configuration ---
const uploadDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, uploadDir); },
    filename: function (req, file, cb) {
        const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(safeOriginalName));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Not an image! Please upload only images.'), false);
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } }).single('image');

// Middleware to handle multer errors
const handleUpload = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) return res.status(400).json({ message: `File Upload Error: ${err.message}` });
        else if (err) return res.status(400).json({ message: err.message || 'File upload failed.' });
        next();
    });
};

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID format specified' });
    next();
};

// --- Routes ---
router.get("/", productController.getAllProducts);
router.post("/", handleUpload, productController.addProducts); // Use multer middleware
router.get("/report/pdf", productController.generateInventoryReport);
router.get("/:id", validateObjectId, productController.getById);
router.put("/:id", validateObjectId, handleUpload, productController.updateProduct); // Use multer middleware
router.delete("/:id", validateObjectId, productController.deleteProduct);
router.post("/:id/sale", validateObjectId, productController.recordSale);
router.post("/:id/restock", validateObjectId, productController.restockProduct);
router.get("/:id/history", validateObjectId, productController.getProductMovementHistory);

export default router;