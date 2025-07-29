import express from 'express';
import { createAd, getAds, getAdById, updateAd, deleteAd, getCategories } from '../Controllers/AdController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for this route
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Multer destination called for file:', file.originalname);
    cb(null, 'uploads/ads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = 'ad-' + uniqueSuffix + path.extname(file.originalname);
    console.log('Multer filename generated:', filename);
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit (increased from 5MB)
  },
  fileFilter: function (req, file, cb) {
    console.log('Multer fileFilter called for:', file.originalname, 'mimetype:', file.mimetype);
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    console.error('Upload error:', err);
    return res.status(400).json({ error: err.message });
  }
  next();
};

// Routes
router.post('/ads', upload.array('images', 5), handleMulterError, createAd); // Allow up to 5 images
router.get('/ads', getAds);
router.get('/ads/:id', getAdById);
router.put('/ads/:id', upload.array('images', 5), handleMulterError, updateAd); // Allow up to 5 images for editing
router.delete('/ads/:id', deleteAd);
router.get('/categories', getCategories);

export default router; 