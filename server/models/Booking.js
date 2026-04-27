import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
    date: { type: String, required: true },
    seats: [{ type: Number, required: true }],
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['held', 'confirmed', 'cancelled'],
      default: 'held',
    },
    heldUntil: { type: Date },
    paymentIntentId: { type: String },
    bookingId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate bookingId before save
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
