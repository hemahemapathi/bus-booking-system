import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import busRoutes from './routes/busRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import Coupon from './models/Coupon.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);

app.get('/', (req, res) => res.json({ message: 'Bus Booking API Running' }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    // Seed default coupons if none exist
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany([
        { code: 'FIRST10',   type: 'percent', value: 10,  desc: '10% off on your first booking', min: 0   },
        { code: 'SAVE50',    type: 'flat',    value: 50,  desc: 'Flat Rs.50 off on any booking',  min: 200 },
        { code: 'TRAVEL100', type: 'flat',    value: 100, desc: 'Rs.100 off on bookings',         min: 500 },
      ]);
      console.log('Default coupons seeded');
    }
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
