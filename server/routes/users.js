const express = require('express');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  db.execute(
    'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(results[0]);
    }
  );
});

// Get user's videos
router.get('/:id/videos', (req, res) => {
  const userId = req.params.id;
  
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.user_id = ? AND v.status = 'published'
     ORDER BY v.created_at DESC`,
    [userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

module.exports = router;