const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { auth } = require('../middleware/auth');
const router = express.Router();
const EmbeddingService = require('../services/embeddingService');

const embeddingService = new EmbeddingService();

// Create upload directories if they don't exist
const createDirectories = () => {
  const directories = [
    'uploads/videos',
    'uploads/thumbnails',
    'uploads/avatars'
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
      cb(null, 'uploads/videos/');
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
    
    console.log('Video file uploaded:', videoFile.filename);
    console.log('Thumbnail file uploaded:', thumbnailFile ? thumbnailFile.filename : 'None');
    
    // Store video filename (relative path from uploads folder)
    const videoFilename = `videos/${videoFile.filename}`;
    
    // Handle thumbnail
    let thumbnailFilename = null;
    if (thumbnailFile) {
      // Use user-uploaded thumbnail
      thumbnailFilename = `thumbnails/${thumbnailFile.filename}`;
      console.log('Custom thumbnail saved:', thumbnailFilename);
    } else {
      // Create a placeholder thumbnail filename (you can generate a default thumbnail later)
      const defaultThumbnailName = `default-thumbnail-${Date.now()}.jpg`;
      thumbnailFilename = `thumbnails/${defaultThumbnailName}`;
      
      // Create a placeholder thumbnail file (you can replace this with actual thumbnail generation)
      const placeholderThumbnailPath = path.join('uploads/thumbnails', defaultThumbnailName);
      try {
        // Create a simple placeholder file (in a real scenario, you might want to copy a default image)
        fs.writeFileSync(placeholderThumbnailPath, 'placeholder');
        console.log('Placeholder thumbnail created:', thumbnailFilename);
      } catch (error) {
        console.error('Error creating placeholder thumbnail:', error);
        thumbnailFilename = null;
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
    
    // Set default duration (since we're not using ffmpeg to get actual duration)
    const duration = 120; // Default duration in seconds
    
    // Save video info to database
    db.execute(
      `INSERT INTO videos 
       (title, description, filename, thumbnail, duration, user_id, category, tags, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'published')`,
      [title, description, videoFilename, thumbnailFilename, duration, userId, category, JSON.stringify(tagsArray)],
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ message: 'Failed to save video info to database' });
        }
        
        console.log('Video saved to database with ID:', results.insertId);
        res.status(201).json({
          message: 'Video uploaded successfully',
          videoId: results.insertId,
          videoFile: videoFilename,
          thumbnail: thumbnailFilename
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

// Get trending videos with filtering options
router.get('/trending', (req, res) => {
  const { category, sort = 'views', time } = req.query;
  
  let query = `
    SELECT v.*, u.username, u.avatar 
    FROM videos v 
    JOIN users u ON v.user_id = u.id 
    WHERE v.status = 'published'
  `;
  
  let params = [];
  
  // Add category filter if provided
  if (category && category !== 'all') {
    query += ' AND v.category = ?';
    params.push(category);
  }
  
  // Add time filter if provided
  if (time && time !== 'all') {
    let dateFilter = '';
    if (time === 'today') {
      dateFilter = 'DATE(v.created_at) = CURDATE()';
    } else if (time === 'week') {
      dateFilter = 'v.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)';
    } else if (time === 'month') {
      dateFilter = 'v.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)';
    }
    
    if (dateFilter) {
      query += ` AND ${dateFilter}`;
    }
  }
  
  // Add sorting
  if (sort === 'views') {
    query += ' ORDER BY v.views DESC';
  } else if (sort === 'likes') {
    query += ' ORDER BY v.like_count DESC';
  } else if (sort === 'newest') {
    query += ' ORDER BY v.created_at DESC';
  } else {
    query += ' ORDER BY v.views DESC';
  }
  
  // Add limit
  query += ' LIMIT 20';
  
  db.execute(query, params, (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error' });
    }
    
    res.json(results);
  });
});


// Search endpoint
router.get('/search', async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Fetch all videos from your database (adjust based on your database setup)
    const videos = await getVideosFromDatabase(); // Implement this function to fetch videos
    const searchResults = await embeddingService.hybridSearch(query, videos, 0.7, 0.3, 20);

    // Map search results to include full video data
    const resultsWithVideoData = searchResults.map(result => {
      const video = videos.find(v => v.id === result.videoId);
      return {
        ...video,
        combinedScore: result.combinedScore,
        semanticScore: result.semanticScore,
        keywordScore: result.keywordScore
      };
    });

    res.json(resultsWithVideoData);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Example function to fetch videos from database (replace with your actual database logic)
async function getVideosFromDatabase() {
  // This is a placeholder; replace with your actual database query
  // e.g., using Sequelize, Mongoose, or another ORM/ODM
  return await Video.findAll(); // Example for Sequelize
}

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


// Add to your videos.js backend routes

// Update video (only by owner or admin)
// Update video (by owner or admin)
router.put(
  '/:id',
  auth,
  upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const videoId = req.params.id;
      const { title, description, category, tags, status } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      // Get the current video to check ownership and existing files
      const [videoRows] = await db.promise().execute('SELECT * FROM videos WHERE id = ?', [videoId]);
      if (videoRows.length === 0) {
        return res.status(404).json({ message: 'Video not found' });
      }
      const video = videoRows[0];

      // Check if the user is the owner or admin
      if (video.user_id !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Not the owner or admin.' });
      }

      // Handle file uploads
      let videoFilename = video.filename;
      let thumbnailFilename = video.thumbnail;

      if (req.files && req.files.video) {
        // New video file uploaded
        const videoFile = req.files.video[0];
        videoFilename = `videos/${videoFile.filename}`;
        // Optionally, delete the old video file
        const oldVideoPath = path.join('uploads', video.filename);
        if (fs.existsSync(oldVideoPath)) {
          fs.unlinkSync(oldVideoPath);
        }
      }

      if (req.files && req.files.thumbnail) {
        // New thumbnail uploaded
        const thumbnailFile = req.files.thumbnail[0];
        thumbnailFilename = `thumbnails/${thumbnailFile.filename}`;
        // Optionally, delete the old thumbnail file
        if (video.thumbnail) {
          const oldThumbnailPath = path.join('uploads', video.thumbnail);
          if (fs.existsSync(oldThumbnailPath)) {
            fs.unlinkSync(oldThumbnailPath);
          }
        }
      }

      // Parse tags if provided
      let tagsArray = video.tags ? JSON.parse(video.tags) : [];
      if (tags) {
        tagsArray = typeof tags === 'string' ? tags.split(',').map((tag) => tag.trim()) : tags;
      }

      // Validate status if provided
      let newStatus = video.status;
      if (status) {
        if (!['processing', 'published', 'failed'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status value' });
        }
        if (userRole !== 'admin' && video.user_id !== userId) {
          return res.status(403).json({ message: 'Only admins or owners can update status' });
        }
        newStatus = status;
      }

      // Build update query
      let updateFields = [];
      let updateValues = [];

      if (title) {
        updateFields.push('title = ?');
        updateValues.push(title);
      }
      if (description) {
        updateFields.push('description = ?');
        updateValues.push(description);
      }
      if (category) {
        updateFields.push('category = ?');
        updateValues.push(category);
      }
      if (tags) {
        updateFields.push('tags = ?');
        updateValues.push(JSON.stringify(tagsArray));
      }
      if (req.files && req.files.video) {
        updateFields.push('filename = ?');
        updateValues.push(videoFilename);
      }
      if (req.files && req.files.thumbnail) {
        updateFields.push('thumbnail = ?');
        updateValues.push(thumbnailFilename);
      }
      if (status && (userRole === 'admin' || video.user_id === userId)) {
        updateFields.push('status = ?');
        updateValues.push(newStatus);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ message: 'No valid fields to update' });
      }

      updateValues.push(videoId);

      const query = `UPDATE videos SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
      await db.promise().execute(query, updateValues);

      // Get the updated video
      const [updatedVideoRows] = await db.promise().execute(
        `SELECT v.*, u.username, u.avatar 
         FROM videos v 
         JOIN users u ON v.user_id = u.id 
         WHERE v.id = ?`,
        [videoId]
      );

      res.json(updatedVideoRows[0]);
    } catch (error) {
      console.error('Update video error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Admin: Get all videos with filtering
router.get('/admin/all', auth, (req, res) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status; // optional filter

  let query = `
    SELECT v.*, u.username, u.avatar 
    FROM videos v 
    JOIN users u ON v.user_id = u.id 
  `;
  let countQuery = `
    SELECT COUNT(*) as total 
    FROM videos v 
    JOIN users u ON v.user_id = u.id 
  `;
  let queryParams = [];
  let countParams = [];

  if (status) {
    query += ' WHERE v.status = ? ';
    countQuery += ' WHERE v.status = ? ';
    queryParams.push(status);
    countParams.push(status);
  }

  query += ' ORDER BY v.created_at DESC LIMIT ? OFFSET ? ';
  queryParams.push(limit, offset);

  db.execute(countQuery, countParams, (error, countResults) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Database error' });
    }

    const total = countResults[0].total;
    const totalPages = Math.ceil(total / limit);

    db.execute(query, queryParams, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        videos: results,
        pagination: {
          currentPage: page,
          totalPages,
          totalVideos: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    });
  });
});

// Admin: Update video status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const videoId = req.params.id;
    const { status } = req.body;

    if (!status || !['processing', 'published', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required' });
    }

    await db.promise().execute(
      'UPDATE videos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, videoId]
    );

    res.json({ message: 'Video status updated successfully' });
  } catch (error) {
    console.error('Update video status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;