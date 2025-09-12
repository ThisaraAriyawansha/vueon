const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const { processVideo, generateThumbnail, getVideoDuration } = require('../utils/ffmpeg');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/raw/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'), false);
    }
  }
});

// Upload video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    const userId = req.user.id;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    
    const filename = path.parse(req.file.filename).name;
    const outputDir = path.join('uploads', 'processed', filename);
    const rawFilePath = req.file.path;
    
    // Get video duration
    const duration = await getVideoDuration(rawFilePath);
    
    // Process video and generate thumbnail
    const { hlsPlaylist } = await processVideo(rawFilePath, outputDir, filename);
    const thumbnail = await generateThumbnail(rawFilePath, outputDir, filename);
    
    // Parse tags if provided
    let tagsArray = [];
    if (tags) {
      tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }
    
    // Save video info to database
    db.execute(
      `INSERT INTO videos 
       (title, description, filename, thumbnail, duration, user_id, category, tags) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, hlsPlaylist, thumbnail, duration, userId, category, JSON.stringify(tagsArray)],
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ message: 'Failed to save video info' });
        }
        
        res.status(201).json({
          message: 'Video uploaded successfully',
          videoId: results.insertId
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get all videos
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.status = 'published'
     ORDER BY v.created_at DESC 
     LIMIT ? OFFSET ?`,
    [limit, offset],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Get video by ID
router.get('/:id', (req, res) => {
  const videoId = req.params.id;
  
  // Increment view count
  db.execute(
    'UPDATE videos SET views = views + 1 WHERE id = ?',
    [videoId]
  );
  
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.id = ?`,
    [videoId],
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      res.json(results[0]);
    }
  );
});

// Get trending videos
router.get('/trending/trending', (req, res) => {
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.status = 'published'
     ORDER BY v.views DESC 
     LIMIT 10`,
    (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

module.exports = router;