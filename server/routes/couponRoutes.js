import express from 'express';
import { getCoupons, getAllCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon } from '../controllers/couponController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/', getCoupons);                              // public — active only
router.post('/validate', protect, validateCoupon);        // auth — validate on payment
router.get('/all', protect, adminOnly, getAllCoupons);     // admin
router.post('/', protect, adminOnly, createCoupon);       // admin
router.patch('/:id', protect, adminOnly, updateCoupon);   // admin
router.delete('/:id', protect, adminOnly, deleteCoupon);  // admin

export default router;
