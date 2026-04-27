import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code:     { type: String, required: true, unique: true, uppercase: true, trim: true },
  type:     { type: String, enum: ['percent', 'flat'], required: true },
  value:    { type: Number, required: true },
  desc:     { type: String, required: true },
  min:      { type: Number, default: 0 },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
