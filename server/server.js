const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');
const emailRoutes = require('./routes/email');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes);


// Serve video files
app.use('/videos', express.static(path.join(__dirname, 'uploads', 'videos'), {
  setHeaders: (res, filePath) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Accept-Ranges', 'bytes');
    
    const ext = path.extname(filePath).toLowerCase();
    
    // Set Content-Type for different video formats
    if (ext === '.mp4') {
      res.set('Content-Type', 'video/mp4');
    } else if (ext === '.webm') {
      res.set('Content-Type', 'video/webm');
    } else if (ext === '.ogv') {
      res.set('Content-Type', 'video/ogg');
    } else if (ext === '.avi') {
      res.set('Content-Type', 'video/x-msvideo');
    } else if (ext === '.mov') {
      res.set('Content-Type', 'video/quicktime');
    } else if (ext === '.mkv') {
      res.set('Content-Type', 'video/x-matroska');
    }
    
    // Cache control for videos
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

// Serve avatars
app.use('/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

// Serve thumbnails
app.use('/thumbnails', express.static(path.join(__dirname, 'uploads', 'thumbnails')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Debug endpoint to check video files
app.get('/api/debug/video/:filename', (req, res) => {
  const fs = require('fs');
  const { filename } = req.params;
  const videoPath = path.join(__dirname, 'uploads', 'videos', filename);
  
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Video file not found', path: videoPath });
  }
  
  const stats = fs.statSync(videoPath);
  
  res.json({
    filename,
    path: videoPath,
    exists: true,
    size: stats.size,
    sizeFormatted: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
    created: stats.birthtime,
    modified: stats.mtime,
    extension: path.extname(filename)
  });
});

// Debug endpoint to list all videos
app.get('/api/debug/videos', (req, res) => {
  const fs = require('fs');
  const videosDir = path.join(__dirname, 'uploads', 'videos');
  
  if (!fs.existsSync(videosDir)) {
    return res.status(404).json({ error: 'Videos directory not found', path: videosDir });
  }
  
  const files = fs.readdirSync(videosDir);
  const videoFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp4', '.webm', '.ogv', '.avi', '.mov', '.mkv'].includes(ext);
  });
  
  const fileDetails = videoFiles.map(file => {
    const filePath = path.join(videosDir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      sizeFormatted: `${(stats.size / (1024 * 1024)).toFixed(2)} MB`,
      extension: path.extname(file),
      created: stats.birthtime,
      modified: stats.mtime
    };
  });
  
  res.json({
    directory: videosDir,
    totalFiles: videoFiles.length,
    files: fileDetails
  });
});

// Debug endpoint to list all thumbnails
app.get('/api/debug/thumbnails', (req, res) => {
  const fs = require('fs');
  const thumbnailsDir = path.join(__dirname, 'uploads', 'thumbnails');
  
  if (!fs.existsSync(thumbnailsDir)) {
    return res.status(404).json({ error: 'Thumbnails directory not found', path: thumbnailsDir });
  }
  
  const files = fs.readdirSync(thumbnailsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
  
  const fileDetails = imageFiles.map(file => {
    const filePath = path.join(thumbnailsDir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
      extension: path.extname(file),
      created: stats.birthtime,
      modified: stats.mtime
    };
  });
  
  res.json({
    directory: thumbnailsDir,
    totalFiles: imageFiles.length,
    files: fileDetails
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});