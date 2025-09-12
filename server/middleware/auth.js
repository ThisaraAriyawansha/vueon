const jwt = require('jsonwebtoken');
const db = require('../config/database');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vueon_secret');
    
    db.execute(
      'SELECT id, username, email, role, avatar FROM users WHERE id = ?',
      [decoded.userId],
      (error, results) => {
        if (error || results.length === 0) {
          return res.status(401).json({ message: 'Token is not valid' });
        }
        
        req.user = results[0];
        next();
      }
    );
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin required.' });
  }
  next();
};

module.exports = { auth, adminAuth };