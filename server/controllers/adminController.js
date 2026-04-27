import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';
import User from '../models/User.js';

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const todayEnd = new Date(); todayEnd.setHours(23,59,59,999);

    const [totalBookings, confirmedBookings, cancelledBookings, heldBookings, totalUsers, totalBuses, revenue,
      todayBookings, todayRevenue, recentBookings, recentUsers, topBuses] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'confirmed' }),
        Booking.countDocuments({ status: 'cancelled' }),
        Booking.countDocuments({ status: 'held' }),
        User.countDocuments(),
        Bus.countDocuments(),
        Booking.aggregate([{ $match: { status: 'confirmed' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
        Booking.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
        Booking.aggregate([{ $match: { status: 'confirmed', createdAt: { $gte: todayStart, $lte: todayEnd } } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
        Booking.find({ status: 'confirmed' })
          .populate('user', 'name email')
          .populate('bus', 'name from to')
          .sort({ createdAt: -1 }).limit(5),
        User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(5),
        Booking.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: '$bus', totalRevenue: { $sum: '$totalPrice' }, totalBookings: { $sum: 1 } } },
          { $sort: { totalRevenue: -1 } },
          { $limit: 5 },
          { $lookup: { from: 'buses', localField: '_id', foreignField: '_id', as: 'bus' } },
          { $unwind: '$bus' },
          { $project: { totalRevenue: 1, totalBookings: 1, 'bus.name': 1, 'bus.from': 1, 'bus.to': 1 } },
        ]),
      ]);

    res.json({
      totalBookings, confirmedBookings, cancelledBookings, heldBookings,
      totalUsers, totalBuses,
      totalRevenue: revenue[0]?.total || 0,
      todayBookings,
      todayRevenue: todayRevenue[0]?.total || 0,
      recentBookings, recentUsers, topBuses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('bus', 'name from to departureTime arrivalTime busType')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/buses
export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/admin/buses
export const createBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/admin/buses/:id
export const updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ error: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/admin/buses/:id
export const deleteBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
