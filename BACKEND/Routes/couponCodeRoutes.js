import express from 'express';
import { createCouponCode, getAllCouponCodes, assignUsersToCoupon, getAllUsers, validateCouponCode, assignUsersToDiscountCoupons, getCouponCodesForUser } from '../Controllers/couponCodeController.js';
// import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// All routes are now public
router.post('/', createCouponCode);
router.get('/', getAllCouponCodes);
router.get('/user/:userId', getCouponCodesForUser);
router.put('/assign', assignUsersToCoupon);
router.get('/users', getAllUsers);
router.post('/assign-users-to-discount', assignUsersToDiscountCoupons);
router.post('/validate', validateCouponCode);

export default router;
