import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Bus from '../models/Bus.js';
import dotenv from 'dotenv';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';
import { generateTicketPDF } from '../utils/pdfService.js';
dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY?.trim();
const stripe = new Stripe(stripeKey);

// Step 1: Hold seats for 10 minutes
export const holdSeats = async (req, res) => {
  try {
    const { busId, date, seats } = req.body;

    if (!busId || !date || !seats || seats.length === 0)
      return res.status(400).json({ error: 'busId, date and seats are required' });

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const now = new Date();

    // Get all active bookings for this bus+date
    const existingBookings = await Booking.find({
      bus: busId,
      date,
      $or: [
        { status: 'confirmed' },
        { status: 'held', heldUntil: { $gt: now } },
      ],
    });

    const takenSeats = existingBookings.flatMap((b) => b.seats);
    const conflict = seats.filter((s) => takenSeats.includes(s));

    if (conflict.length > 0)
      return res.status(409).json({
        error: `Seats ${conflict.join(', ')} are already booked or held`,
      });

    const heldUntil = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes

    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      date,
      seats,
      passengers: [],
      totalPrice: seats.length * bus.price,
      status: 'held',
      heldUntil,
    });

    res.status(201).json({ bookingId: booking._id, heldUntil, totalPrice: booking.totalPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 2: Create Stripe payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) return res.status(400).json({ error: 'bookingId is required' });

    const booking = await Booking.findById(bookingId).populate('bus');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    if (booking.status !== 'held')
      return res.status(400).json({ error: `Booking status is '${booking.status}', expected 'held'` });
    if (new Date() > booking.heldUntil)
      return res.status(400).json({ error: 'Seat hold expired. Please select seats again' });

    // Reuse existing paymentIntent if already created
    if (booking.paymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
      if (existing.status === 'requires_payment_method' || existing.status === 'requires_confirmation') {
        return res.json({ clientSecret: existing.client_secret });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking.totalPrice * 100,
      currency: 'inr',
      metadata: { bookingId: booking._id.toString() },
      payment_method_types: ['card'],
    });

    booking.paymentIntentId = paymentIntent.id;
    await booking.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Step 3: Confirm booking after payment success
export const confirmBooking = async (req, res) => {
  try {
    const { bookingId, passengers } = req.body;

    if (!passengers || passengers.length === 0)
      return res.status(400).json({ error: 'Passenger details required' });

    const booking = await Booking.findById(bookingId).populate('bus');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    if (new Date() > booking.heldUntil && booking.status === 'held')
      return res.status(400).json({ error: 'Seat hold expired' });

    // Verify payment with Stripe using the stored paymentIntentId (not client secret)
    if (!booking.paymentIntentId)
      return res.status(400).json({ error: 'Payment not initiated' });

    const paymentIntent = await stripe.paymentIntents.retrieve(booking.paymentIntentId);
    if (paymentIntent.status !== 'succeeded')
      return res.status(400).json({ error: `Payment not completed. Status: ${paymentIntent.status}` });

    const sanitize = (str) => String(str).replace(/[<>&"']/g, '')

    booking.passengers = passengers.map(p => ({
      name: sanitize(p.name),
      age: Number(p.age),
      gender: p.gender,
    }))
    booking.status = 'confirmed';
    booking.heldUntil = undefined;
    await booking.save();

    // Send confirmation email
    try {
      await sendBookingConfirmationEmail(booking, req.user);
    } catch (emailErr) {
      console.error('Email failed:', emailErr.message);
    }

    res.json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
      status: { $in: ['confirmed', 'held'] },
    })
      .populate('bus', 'name operator from to departureTime arrivalTime busType')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Download PDF ticket
export const downloadTicket = async (req, res) => {
  try {
    const isObjectId = /^[a-f\d]{24}$/i.test(req.params.id);
    const booking = await (isObjectId
      ? Booking.findById(req.params.id)
      : Booking.findOne({ bookingId: req.params.id })
    ).populate('bus');
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    if (booking.status !== 'confirmed')
      return res.status(400).json({ error: 'Only confirmed bookings can be downloaded' });

    const pdfBuffer = await generateTicketPDF(booking, req.user);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=ticket-${booking.bookingId}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get seat availability for a bus on a date
export const getSeatAvailability = async (req, res) => {
  try {
    const { busId, date } = req.query;
    if (!busId || !date) return res.status(400).json({ error: 'busId and date are required' });

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    const now = new Date();
    const bookings = await Booking.find({
      bus: busId,
      date,
      $or: [
        { status: 'confirmed' },
        { status: 'held', heldUntil: { $gt: now } },
      ],
    });

    const bookedSeats = bookings.flatMap((b) => b.seats);
    const allSeats = Array.from({ length: bus.totalSeats }, (_, i) => i + 1);
    const availableSeats = allSeats.filter((s) => !bookedSeats.includes(s));

    res.json({
      totalSeats: bus.totalSeats,
      bookedSeats,
      availableSeats,
      availableCount: availableSeats.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ error: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ error: 'Already cancelled' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
