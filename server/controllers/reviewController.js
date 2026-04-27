import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';

// POST /api/reviews — submit a review
export const submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;
    if (!bookingId || !rating) return res.status(400).json({ error: 'bookingId and rating are required' });

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    if (booking.status !== 'confirmed')
      return res.status(400).json({ error: 'Only confirmed bookings can be reviewed' });

    const existing = await Review.findOne({ booking: bookingId });
    if (existing) return res.status(400).json({ error: 'You already reviewed this booking' });

    const review = await Review.create({
      user: req.user._id,
      bus: booking.bus,
      booking: bookingId,
      rating,
      comment,
    });

    // Update bus average rating
    const reviews = await Review.find({ bus: booking.bus });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Bus.findByIdAndUpdate(booking.bus, { rating: Math.round(avgRating * 10) / 10 });

    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'You already reviewed this booking' });
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/bus/:busId — get reviews for a bus
export const getBusReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bus: req.params.busId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/my — get current user's reviews (to check which bookings are reviewed)
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id }).select('booking');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reviews/recent — public, latest reviews for home page
export const getRecentReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name')
      .populate('bus', 'name from to')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
