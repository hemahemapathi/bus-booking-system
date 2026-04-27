import express from 'express';
import {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  deleteUser,
  deleteBooking,
} from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.delete('/bookings/:id', deleteBooking);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/buses', getAllBuses);
router.post('/buses', createBus);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);

export default router;
