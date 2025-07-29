import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from '../Controllers/CategoryController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// --- Public routes ---
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// --- Admin-only routes ---
router.post('/', requireAuth, createCategory);
router.put('/:id', requireAuth, updateCategory);
router.delete('/:id', requireAuth, deleteCategory);

export default router; 