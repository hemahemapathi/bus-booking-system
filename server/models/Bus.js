import mongoose from 'mongoose';

const busSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    operator: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    totalSeats: { type: Number, default: 40 },
    busType: {
      type: String,
      enum: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Non-AC Seater', 'Volvo AC', 'Volvo'],
      required: true,
    },
    amenities: [{ type: String }],
    rating: { type: Number, default: 4.0 },
    availableDays: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Bus', busSchema);
