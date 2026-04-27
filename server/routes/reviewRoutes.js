import express from 'express';
import { submitReview, getBusReviews, getMyReviews, getRecentReviews } from '../controllers/reviewController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/my', protect, getMyReviews);
router.get('/recent', getRecentReviews);
router.get('/bus/:busId', getBusReviews);

export default router;
