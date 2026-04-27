import express from 'express';
import {
  holdSeats,
  createPaymentIntent,
  confirmBooking,
  getMyBookings,
  cancelBooking,
  downloadTicket,
  getSeatAvailability,
} from '../controllers/bookingController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/hold', protect, holdSeats);
router.post('/payment-intent', protect, createPaymentIntent);
router.post('/confirm', protect, confirmBooking);
router.get('/my', protect, getMyBookings);
router.get('/availability', protect, getSeatAvailability);
router.get('/ticket/:id', protect, downloadTicket);
router.patch('/cancel/:id', protect, cancelBooking);

export default router;
