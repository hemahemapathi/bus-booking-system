import Bus from '../models/Bus.js';
import Booking from '../models/Booking.js';

export const getPublicBuses = async (req, res) => {
  try {
    const buses = await Bus.find().select('from to name').lean()
    res.json(buses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    if (!from || !to || !date)
      return res.status(400).json({ error: 'from, to and date are required' });

    const buses = await Bus.find({
      from: { $regex: new RegExp(escapeRegex(from), 'i') },
      to: { $regex: new RegExp(escapeRegex(to), 'i') },
    });

    // For each bus, count booked/held seats for that date
    const now = new Date();
    const busesWithAvailability = await Promise.all(
      buses.map(async (bus) => {
        const bookings = await Booking.find({
          bus: bus._id,
          date,
          $or: [
            { status: 'confirmed' },
            { status: 'held', heldUntil: { $gt: now } },
          ],
        });
        const bookedSeats = bookings.flatMap((b) => b.seats);
        const availableSeats = bus.totalSeats - bookedSeats.length;
        return { ...bus.toObject(), availableSeats };
      })
    );

    res.json(busesWithAvailability);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBookedSeats = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date is required' });

    const now = new Date();
    const bookings = await Booking.find({
      bus: id,
      date,
      $or: [
        { status: 'confirmed' },
        { status: 'held', heldUntil: { $gt: now } },
      ],
    }).select('seats passengers status');

    // Build seat → gender map from confirmed bookings only
    const seatGenderMap = {}
    bookings.forEach((b) => {
      if (b.status === 'confirmed') {
        b.seats.forEach((seat, i) => {
          const passenger = b.passengers[i]
          if (passenger) seatGenderMap[seat] = passenger.gender
        })
      }
    })

    const bookedSeats = bookings.flatMap((b) => b.seats);
    res.json({ bookedSeats, seatGenderMap });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
