import express from 'express';
import { createCustomization, getAllCustomizations, getCustomization, updateCustomization, deleteCustomization, updateCustomizationStatus ,  } from '../Controllers/CustomizationController.js';

const router = express.Router();

router.post('/', createCustomization);
router.get('/', getAllCustomizations);
router.get('/:id', getCustomization);
router.put('/:id', updateCustomization);
router.delete('/:id', deleteCustomization);
router.patch('/:id/status', updateCustomizationStatus);

export default router;