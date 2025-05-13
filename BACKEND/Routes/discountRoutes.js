import express from 'express';
import { createDiscount, getDiscounts, updateDiscount, deleteDiscount } from '../Controllers/discountController.js';

const router = express.Router();

// CRUD routes for discounts
router.post('/', createDiscount);
router.get('/', getDiscounts);
router.put('/:id', updateDiscount);
router.delete('/:id', deleteDiscount);

export default router;