import Ad from '../Model/Ad.js';
import Category from '../Model/Category.js';
import fs from 'fs';
import path from 'path';

// Create a new ad
export const createAd = async (req, res) => {
  try {
    console.log('Creating ad with data:', req.body);
    console.log('Files received:', req.files);
    
    const adData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'uploaded files');
      adData.images = req.files.map(file => {
        const imagePath = "/uploads/ads/" + file.filename;
        const fullFilePath = path.join(process.cwd(), 'uploads', 'ads', file.filename);
        
        console.log('File:', file.originalname, '→ Saved as:', file.filename, '→ Path:', imagePath);
        console.log('Full file path:', fullFilePath);
        console.log('File exists:', fs.existsSync(fullFilePath));
        
        return imagePath;
      });
      console.log('Final image paths:', adData.images);
    } else {
      console.log('No files uploaded');
      adData.images = []; // Ensure images is always an array
    }
    
    // Validate required fields
    if (!adData.title || !adData.description || !adData.category || !adData.contactInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const ad = new Ad(adData);
    await ad.save();
    console.log('Ad created successfully:', ad._id);
    console.log('Ad images:', ad.images);
    res.status(201).json(ad);
  } catch (err) {
    console.error('Error creating ad:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// Get all ads
export const getAds = async (req, res) => {
  try {
    console.log('Getting ads with query params:', req.query);
    
    let query = {};
    
    // Filter by category if provided
    if (req.query.category) {
      query.category = req.query.category;
      console.log('Filtering by category:', req.query.category);
    }
    
    const ads = await Ad.find(query).sort({ date: -1 });
    console.log(`Found ${ads.length} ads${req.query.category ? ` for category: ${req.query.category}` : ''}`);
    res.json(ads);
  } catch (err) {
    console.error('Error getting ads:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get ad by ID
export const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update ad
export const updateAd = async (req, res) => {
  try {
    console.log('Updating ad with data:', req.body);
    console.log('Files received:', req.files);
    
    const adId = req.params.id;
    const ad = await Ad.findById(adId);
    
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' });
    }
    
    // Check if user owns this ad
    if (req.body.user && ad.user.toString() !== req.body.user) {
      return res.status(403).json({ error: 'Not authorized to edit this ad' });
    }
    
    const updateData = { ...req.body };
    
    // Handle existing images
    let finalImages = [];
    if (req.body.existingImages) {
      // Handle multiple existingImages (they come as separate entries)
      const existingImages = Array.isArray(req.body.existingImages) 
        ? req.body.existingImages 
        : [req.body.existingImages];
      
      console.log('Existing images to keep:', existingImages);
      finalImages = existingImages;
    }
    
    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'new uploaded files');
      const newImagePaths = req.files.map(file => {
        const imagePath = "/uploads/ads/" + file.filename;
        const fullFilePath = path.join(process.cwd(), 'uploads', 'ads', file.filename);
        
        console.log('New file:', file.originalname, '→ Saved as:', file.filename, '→ Path:', imagePath);
        console.log('Full file path:', fullFilePath);
        console.log('File exists:', fs.existsSync(fullFilePath));
        
        return imagePath;
      });
      
      finalImages = [...finalImages, ...newImagePaths];
      console.log('New image paths:', newImagePaths);
    }
    
    // Update images array
    updateData.images = finalImages;
    console.log('Final images array:', finalImages);
    
    // Validate required fields
    if (!updateData.title || !updateData.description || !updateData.category || !updateData.contactInfo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Update the ad
    const updatedAd = await Ad.findByIdAndUpdate(
      adId, 
      updateData, 
      { new: true, runValidators: true }
    );
    
    console.log('Ad updated successfully:', updatedAd._id);
    console.log('Updated ad images:', updatedAd.images);
    
    res.json(updatedAd);
  } catch (err) {
    console.error('Error updating ad:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
};

// Delete ad
export const deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: 'Ad not found' });
    if (req.body.user && ad.user.toString() !== req.body.user) {
      return res.status(403).json({ error: 'Not authorized to delete this ad' });
    }
    await ad.deleteOne();
    res.json({ message: 'Ad deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 