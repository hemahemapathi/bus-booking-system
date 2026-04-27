const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ error: 'Admin access only' });
};

export default adminOnly;
