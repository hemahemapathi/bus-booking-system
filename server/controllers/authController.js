import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
      return res.status(400).json({ error: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const role = email.endsWith('@admins.com') ? 'admin' : 'user';
    const user = await User.create({ name, email, password, phone, role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ error: 'Invalid email or password' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body
    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (phone) user.phone = phone

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ error: 'Current password required' })
      const match = await user.matchPassword(currentPassword)
      if (!match) return res.status(400).json({ error: 'Current password is incorrect' })
      user.password = newPassword
    }

    await user.save()
    res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role, token: generateToken(user._id) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
