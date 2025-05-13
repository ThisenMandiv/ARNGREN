import express from 'express';
import { 
  createPromotion, 
  getPromotions, 
  getPromotionById, 
  updatePromotion, 
  deletePromotion, 
  assignUsersToPromotion 
} from '../Controllers/promotionController.js';

const router = express.Router();

// CRUD routes for promotions
router.post('/assign', assignUsersToPromotion);
router.post('/', createPromotion);
router.get('/', getPromotions);
router.get('/:id', getPromotionById);
router.put('/:id', updatePromotion);
router.delete('/:id', deletePromotion);

export default router;