const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const { processVideo, generateThumbnail, getVideoDuration } = require('../utils/ffmpeg');
const router = express.Router();

// Create upload directories if they don't exist
const createDirectories = () => {
  const directories = [
    'uploads/raw',
    'uploads/processed',
    'uploads/avatars',
    'uploads/thumbnails'
  ];
  
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

createDirectories();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/raw/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    } else {
      cb(new Error('Invalid fieldname'), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video' && file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else if (file.fieldname === 'thumbnail' && file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Upload video
router.post('/upload', auth, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log('Upload request received');
    const { title, description, category, tags } = req.body;
    const userId = req.user.id;
    
    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: 'No video file provided' });
    }
    
    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;
    
    console.log('File uploaded:', videoFile.filename);
    const filename = path.parse(videoFile.filename).name;
    const outputDir = path.join('uploads', 'processed');
    const rawFilePath = videoFile.path;
    
    // Get video duration
    let duration = 0;
    try {
      duration = await getVideoDuration(rawFilePath);
      console.log('Video duration:', duration);
    } catch (error) {
      console.error('Error getting video duration:', error);
      duration = 120; // Default duration if cannot determine
    }
    
    // Process video
    let hlsPlaylist;
    try {
      const processingResult = await processVideo(rawFilePath, outputDir, filename);
      hlsPlaylist = processingResult.hlsPlaylist;
      console.log('Video processed successfully:', hlsPlaylist);
    } catch (error) {
      console.error('Error processing video:', error);
      // Fallback: use original file
      hlsPlaylist = `${filename}/${filename}${path.extname(videoFile.originalname)}`;
      
      // Create directory and copy file
      const videoDir = path.join(outputDir, filename);
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }
      fs.copyFileSync(rawFilePath, path.join(videoDir, `${filename}${path.extname(videoFile.originalname)}`));
    }
    
    // Handle thumbnail
    let thumbnail;
    if (thumbnailFile) {
      // Use user-uploaded thumbnail
      const thumbnailExt = path.extname(thumbnailFile.filename);
      const thumbnailFilename = `${filename}${thumbnailExt}`;
      const videoDir = path.join(outputDir, filename);
      
      if (!fs.existsSync(videoDir)) {
        fs.mkdirSync(videoDir, { recursive: true });
      }
      
      // Move thumbnail to video directory
      fs.renameSync(thumbnailFile.path, path.join(videoDir, thumbnailFilename));
      thumbnail = `${filename}/${thumbnailFilename}`;
      console.log('Custom thumbnail saved:', thumbnail);
    } else {
      // Generate thumbnail from video
      try {
        thumbnail = await generateThumbnail(rawFilePath, outputDir, filename);
        console.log('Thumbnail generated:', thumbnail);
      } catch (error) {
        console.error('Error generating thumbnail:', error);
        // Create placeholder thumbnail
        const videoDir = path.join(outputDir, filename);
        if (!fs.existsSync(videoDir)) {
          fs.mkdirSync(videoDir, { recursive: true });
        }
        fs.writeFileSync(path.join(videoDir, 'thumbnail.jpg'), 'placeholder');
        thumbnail = `${filename}/thumbnail.jpg`;
      }
    }
    
    // Parse tags if provided
    let tagsArray = [];
    if (tags) {
      try {
        tagsArray = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (error) {
        console.error('Error parsing tags:', error);
        tagsArray = [];
      }
    }
    
    // Save video info to database
    db.execute(
      `INSERT INTO videos 
       (title, description, filename, thumbnail, duration, user_id, category, tags, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [title, description, hlsPlaylist, thumbnail, duration, userId, category, JSON.stringify(tagsArray)],
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ message: 'Failed to save video info to database' });
        }
        
        console.log('Video saved to database with ID:', results.insertId);
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


// Get all videos - Updated query
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
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Get trending videos - Updated query
router.get('/trending', (req, res) => {
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.status = 'published'
     ORDER BY v.views DESC 
     LIMIT 10`,
    [],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Get video by ID - Updated query
router.get('/:id', (req, res) => {
  const videoId = req.params.id;
  
  // Increment view count
  db.execute(
    'UPDATE videos SET views = views + 1 WHERE id = ?',
    [videoId],
    (error) => {
      if (error) {
        console.error('Error updating view count:', error);
      }
    }
  );
  
  db.execute(
    `SELECT v.*, u.username, u.avatar 
     FROM videos v 
     JOIN users u ON v.user_id = u.id 
     WHERE v.id = ?`,
    [videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
      
      res.json(results[0]);
    }
  );
});




// Get comments for a video
router.get('/:id/comments', (req, res) => {
  const videoId = req.params.id;
  
  db.execute(
    `SELECT c.*, u.username, u.avatar 
     FROM comments c 
     JOIN users u ON c.user_id = u.id 
     WHERE c.video_id = ? 
     ORDER BY c.created_at DESC`,
    [videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json(results);
    }
  );
});

// Add a comment to a video
router.post('/:id/comments', auth, (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Comment content is required' });
  }
  
  db.execute(
    'INSERT INTO comments (content, user_id, video_id) VALUES (?, ?, ?)',
    [content.trim(), userId, videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Failed to add comment' });
      }
      
      // Get the newly created comment with user info
      db.execute(
        `SELECT c.*, u.username, u.avatar 
         FROM comments c 
         JOIN users u ON c.user_id = u.id 
         WHERE c.id = ?`,
        [results.insertId],
        (error, commentResults) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Failed to retrieve comment' });
          }
          
          res.status(201).json(commentResults[0]);
        }
      );
    }
  );
});

// Like a video
router.post('/:id/like', auth, (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;
  
  // Check if user already liked the video
  db.execute(
    'SELECT id FROM likes WHERE user_id = ? AND video_id = ?',
    [userId, videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.length > 0) {
        return res.status(400).json({ message: 'Video already liked' });
      }
      
      // Add like
      db.execute(
        'INSERT INTO likes (user_id, video_id) VALUES (?, ?)',
        [userId, videoId],
        (error) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Failed to like video' });
          }
          
          // Update like count in videos table
          db.execute(
            'UPDATE videos SET like_count = like_count + 1 WHERE id = ?',
            [videoId],
            (error) => {
              if (error) {
                console.error('Database error:', error);
                return res.status(500).json({ message: 'Failed to update like count' });
              }
              
              res.json({ message: 'Video liked successfully' });
            }
          );
        }
      );
    }
  );
});

// Unlike a video
router.delete('/:id/like', auth, (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;
  
  db.execute(
    'DELETE FROM likes WHERE user_id = ? AND video_id = ?',
    [userId, videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (results.affectedRows === 0) {
        return res.status(400).json({ message: 'Video not liked' });
      }
      
      // Update like count in videos table
      db.execute(
        'UPDATE videos SET like_count = like_count - 1 WHERE id = ?',
        [videoId],
        (error) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Failed to update like count' });
          }
          
          res.json({ message: 'Video unliked successfully' });
        }
      );
    }
  );
});

// Check if user liked a video
router.get('/:id/like', auth, (req, res) => {
  const videoId = req.params.id;
  const userId = req.user.id;
  
  db.execute(
    'SELECT id FROM likes WHERE user_id = ? AND video_id = ?',
    [userId, videoId],
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }
      
      res.json({ liked: results.length > 0 });
    }
  );
});






module.exports = router;