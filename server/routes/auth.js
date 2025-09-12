const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { auth } = require('../middleware/auth'); // Add this import
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    db.execute(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length > 0) {
          return res.status(400).json({ message: 'User already exists' });
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Create user
        db.execute(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          (error, results) => {
            if (error) {
              return res.status(500).json({ message: 'Database error' });
            }
            
            // Generate JWT
            const token = jwt.sign(
              { userId: results.insertId },
              process.env.JWT_SECRET || 'vueon_secret',
              { expiresIn: '7d' }
            );
            
            res.status(201).json({
              message: 'User created successfully',
              token,
              user: {
                id: results.insertId,
                username,
                email
              }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (results.length === 0) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const user = results[0];
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Generate JWT
        const token = jwt.sign(
          { userId: user.id },
          process.env.JWT_SECRET || 'vueon_secret',
          { expiresIn: '7d' }
        );
        
        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Get current user
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});


module.exports = router;