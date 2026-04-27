import Coupon from '../models/Coupon.js';

// GET /api/coupons — public, only active coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ active: true }).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/coupons/all — admin, all coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/coupons — admin create
export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Coupon code already exists' });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/coupons/:id — admin update
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/coupons/:id — admin delete
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/coupons/validate — used by Payment page
export const validateCoupon = async (req, res) => {
  try {
    const { code, totalPrice } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase().trim(), active: true });
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });
    if (totalPrice < coupon.min) return res.status(400).json({ error: `Minimum booking amount is Rs.${coupon.min}` });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
