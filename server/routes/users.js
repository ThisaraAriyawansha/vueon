const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Configure multer for avatar uploads
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: avatarStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  
  db.execute(
    'SELECT id, username, email, avatar, created_at FROM users WHERE id = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
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
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Update user profile
router.put('/:id', auth, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is updating their own profile
    if (req.user.id !== parseInt(userId)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { username, email, currentPassword, newPassword } = req.body;
    let updateFields = [];
    let updateValues = [];

    // Check if username is being changed and if it's available
    if (username && username !== req.user.username) {
      const [existingUserRows] = await db.promise().execute(
        'SELECT id FROM users WHERE username = ? AND id != ?',
        [username, userId]
      );
      
      if (existingUserRows.length > 0) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      
      updateFields.push('username = ?');
      updateValues.push(username);
    }

    // Check if email is being changed and if it's available
    if (email && email !== req.user.email) {
      const [existingUserRows] = await db.promise().execute(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, userId]
      );
      
      if (existingUserRows.length > 0) {
        return res.status(400).json({ message: 'Email already taken' });
      }
      
      updateFields.push('email = ?');
      updateValues.push(email);
    }

    // Handle password change
    if (currentPassword && newPassword) {
      const [userRows] = await db.promise().execute(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );
      
      if (userRows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, userRows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateFields.push('password = ?');
      updateValues.push(hashedPassword);
    }

    // Handle avatar upload
    if (req.file) {
      const avatarPath = `avatars/${req.file.filename}`;
      updateFields.push('avatar = ?');
      updateValues.push(avatarPath);
    }

    if (updateFields.length > 0) {
      updateValues.push(userId);
      
      await db.promise().execute(
        `UPDATE users SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updateValues
      );
    }

    // Get updated user data
    const [updatedUserRows] = await db.promise().execute(
      'SELECT id, username, email, avatar, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (updatedUserRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user: updatedUserRows[0]
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Subscribe to a channel
router.post('/subscribe/:channelId', auth, (req, res) => {
  const channelId = req.params.channelId;
  const subscriberId = req.user.id;

  if (parseInt(channelId) === subscriberId) {
    return res.status(400).json({ message: 'Cannot subscribe to your own channel' });
  }

  // Check if already subscribed
  db.execute(
    'SELECT id FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
    [subscriberId, channelId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: 'Already subscribed to this channel' });
      }

      // Add subscription
      db.execute(
        'INSERT INTO subscriptions (subscriber_id, channel_id) VALUES (?, ?)',
        [subscriberId, channelId],
        (error) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Failed to subscribe' });
          }

          res.json({ message: 'Subscribed successfully' });
        }
      );
    }
  );
});

// Unsubscribe from a channel
router.delete('/subscribe/:channelId', auth, (req, res) => {
  const channelId = req.params.channelId;
  const subscriberId = req.user.id;

  db.execute(
    'DELETE FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
    [subscriberId, channelId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.affectedRows === 0) {
        return res.status(400).json({ message: 'Not subscribed to this channel' });
      }

      res.json({ message: 'Unsubscribed successfully' });
    }
  );
});

// Check if user is subscribed to a channel
router.get('/subscribe/:channelId', auth, (req, res) => {
  const channelId = req.params.channelId;
  const subscriberId = req.user.id;

  db.execute(
    'SELECT id FROM subscriptions WHERE subscriber_id = ? AND channel_id = ?',
    [subscriberId, channelId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ subscribed: results.length > 0 });
    }
  );
});

// Get subscriber count for a channel
router.get('/channel/:channelId/subscribers', (req, res) => {
  const channelId = req.params.channelId;

  db.execute(
    'SELECT COUNT(*) as count FROM subscriptions WHERE channel_id = ?',
    [channelId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ count: results[0].count });
    }
  );
});


// In your backend routes (users.js)

// Get user's liked videos
router.get('/:id/liked-videos', auth, (req, res) => {
  const userId = req.params.id;
  
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     JOIN likes l ON v.id = l.video_id
     WHERE l.user_id = ? AND v.status = 'published'
     ORDER BY l.created_at DESC`,
    [userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Get user's subscriber count
router.get('/:id/subscribers/count', (req, res) => {
  const userId = req.params.id;
  
  db.execute(
    'SELECT COUNT(*) as count FROM subscriptions WHERE channel_id = ?',
    [userId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json({ count: results[0].count });
    }
  );
});
module.exports = router;