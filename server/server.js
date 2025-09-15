const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const userRoutes = require('./routes/users');

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

// Serve processed videos and their contents with HLS support
app.use('/videos', express.static(path.join(__dirname, 'uploads', 'processed'), {
  setHeaders: (res, filePath) => {
    // CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Accept-Ranges', 'bytes');
    
    const ext = path.extname(filePath).toLowerCase();
    
    // Set Content-Type for HLS files
    if (ext === '.m3u8') {
      res.set('Content-Type', 'application/vnd.apple.mpegurl');
      res.set('Cache-Control', 'no-cache');
    } else if (ext === '.ts') {
      res.set('Content-Type', 'video/mp2t');
      res.set('Cache-Control', 'public, max-age=31536000');
    } else if (ext === '.mp4') {
      res.set('Content-Type', 'video/mp4');
    }
  }
}));

// Serve avatars
app.use('/avatars', express.static(path.join(__dirname, 'uploads', 'avatars')));

// Serve raw thumbnails
app.use('/thumbnails', express.static(path.join(__dirname, 'uploads', 'thumbnails')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Debug endpoint to check video files
app.get('/api/debug/video/:folder', (req, res) => {
  const fs = require('fs');
  const { folder } = req.params;
  const videoDir = path.join(__dirname, 'uploads', 'processed', folder);
  
  if (!fs.existsSync(videoDir)) {
    return res.status(404).json({ error: 'Video folder not found', path: videoDir });
  }
  
  const files = fs.readdirSync(videoDir);
  const fileDetails = files.map(file => {
    const filePath = path.join(videoDir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      size: stats.size,
      isFile: stats.isFile(),
      extension: path.extname(file)
    };
  });
  
  res.json({
    folder,
    path: videoDir,
    files: fileDetails,
    totalFiles: files.length
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});