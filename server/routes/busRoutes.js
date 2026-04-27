import express from 'express';
import { getPublicBuses, searchBuses, getBusById, getBookedSeats } from '../controllers/busController.js';

const router = express.Router();

router.get('/all', getPublicBuses);
router.get('/search', searchBuses);
router.get('/:id', getBusById);
router.get('/:id/seats', getBookedSeats);

export default router;
