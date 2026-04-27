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

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>redbus API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f3f4f6; color: #1f2937; }
    .header { background: #dc2626; color: white; padding: 32px 24px; text-align: center; }
    .header h1 { font-size: 2rem; font-weight: 800; margin-bottom: 6px; }
    .header p { font-size: 0.95rem; opacity: 0.85; }
    .badge { display: inline-block; background: white; color: #dc2626; font-size: 0.75rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-top: 10px; }
    .container { max-width: 860px; margin: 32px auto; padding: 0 16px; }
    .status { background: white; border-radius: 16px; padding: 20px 24px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .dot { width: 12px; height: 12px; background: #22c55e; border-radius: 50%; flex-shrink: 0; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .status p { font-weight: 600; color: #15803d; }
    .status span { font-size: 0.8rem; color: #6b7280; }
    .section { background: white; border-radius: 16px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .section h2 { font-size: 1rem; font-weight: 700; color: #dc2626; margin-bottom: 16px; padding-bottom: 10px; border-bottom: 2px solid #fee2e2; }
    .endpoint { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f3f4f6; }
    .endpoint:last-child { border-bottom: none; }
    .method { font-size: 0.7rem; font-weight: 800; padding: 3px 8px; border-radius: 6px; min-width: 52px; text-align: center; flex-shrink: 0; }
    .get { background: #dbeafe; color: #1d4ed8; }
    .post { background: #dcfce7; color: #15803d; }
    .patch { background: #fef9c3; color: #854d0e; }
    .put { background: #ede9fe; color: #6d28d9; }
    .delete { background: #fee2e2; color: #dc2626; }
    .path { font-family: monospace; font-size: 0.85rem; color: #374151; font-weight: 600; }
    .desc { font-size: 0.8rem; color: #9ca3af; margin-left: auto; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .card { background: #fef2f2; border-radius: 12px; padding: 16px; text-align: center; }
    .card p { font-size: 1.5rem; font-weight: 800; color: #dc2626; }
    .card span { font-size: 0.75rem; color: #6b7280; }
    @media(max-width:600px){ .grid{grid-template-columns:1fr 1fr;} .desc{display:none;} }
  </style>
</head>
<body>
  <div class="header">
    <h1>🚌 redbus API</h1>
    <p>Online Bus Ticket Booking Platform — REST API</p>
    <span class="badge">v1.0.0</span>
  </div>

  <div class="container">

    <div class="status">
      <div class="dot"></div>
      <div>
        <p>Server is running</p>
        <span>MongoDB connected · All systems operational</span>
      </div>
    </div>

    <div class="grid" style="margin-bottom:20px">
      <div class="card"><p>6</p><span>Route Groups</span></div>
      <div class="card"><p>24+</p><span>API Endpoints</span></div>
      <div class="card"><p>JWT</p><span>Auth Method</span></div>
      <div class="card"><p>Stripe</p><span>Payments</span></div>
    </div>

    <div class="section">
      <h2>🔐 Auth</h2>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/auth/register</span><span class="desc">Register new user</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/auth/login</span><span class="desc">Login</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/auth/profile</span><span class="desc">Get profile</span></div>
      <div class="endpoint"><span class="method patch">PATCH</span><span class="path">/api/auth/profile</span><span class="desc">Update profile</span></div>
    </div>

    <div class="section">
      <h2>🚌 Buses</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/buses/all</span><span class="desc">Get all buses</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/buses/search</span><span class="desc">Search by route & date</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/buses/:id</span><span class="desc">Get bus by ID</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/buses/:id/seats</span><span class="desc">Get booked seats</span></div>
    </div>

    <div class="section">
      <h2>🎟️ Bookings</h2>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/bookings/hold</span><span class="desc">Hold seats (10 min)</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/bookings/payment-intent</span><span class="desc">Create payment intent</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/bookings/confirm</span><span class="desc">Confirm booking</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/bookings/my</span><span class="desc">My bookings</span></div>
      <div class="endpoint"><span class="method patch">PATCH</span><span class="path">/api/bookings/cancel/:id</span><span class="desc">Cancel booking</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/bookings/ticket/:id</span><span class="desc">Download PDF ticket</span></div>
    </div>

    <div class="section">
      <h2>🎁 Coupons</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/coupons</span><span class="desc">Active coupons</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/coupons/validate</span><span class="desc">Validate coupon</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/coupons/all</span><span class="desc">All coupons (admin)</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/coupons</span><span class="desc">Create coupon (admin)</span></div>
      <div class="endpoint"><span class="method patch">PATCH</span><span class="path">/api/coupons/:id</span><span class="desc">Update coupon (admin)</span></div>
      <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/coupons/:id</span><span class="desc">Delete coupon (admin)</span></div>
    </div>

    <div class="section">
      <h2>⭐ Reviews</h2>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/reviews</span><span class="desc">Submit review</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/reviews/my</span><span class="desc">My reviews</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/reviews/recent</span><span class="desc">Recent reviews</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/reviews/bus/:busId</span><span class="desc">Bus reviews</span></div>
    </div>

    <div class="section">
      <h2>🛡️ Admin</h2>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/admin/dashboard</span><span class="desc">Dashboard stats</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/admin/buses</span><span class="desc">List buses</span></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/admin/buses</span><span class="desc">Create bus</span></div>
      <div class="endpoint"><span class="method put">PUT</span><span class="path">/api/admin/buses/:id</span><span class="desc">Update bus</span></div>
      <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/admin/buses/:id</span><span class="desc">Delete bus</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/admin/bookings</span><span class="desc">All bookings</span></div>
      <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/admin/bookings/:id</span><span class="desc">Delete booking</span></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/admin/users</span><span class="desc">All users</span></div>
      <div class="endpoint"><span class="method delete">DELETE</span><span class="path">/api/admin/users/:id</span><span class="desc">Delete user</span></div>
    </div>

    <p style="text-align:center;color:#9ca3af;font-size:0.8rem;padding:16px 0 32px">🚌 redbus API · Built with Node.js + Express + MongoDB</p>
  </div>
</body>
</html>
`));

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
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
