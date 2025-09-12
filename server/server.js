const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const { auth } = require('./middleware/auth');
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


// Serve processed videos
app.use('/videos', express.static(path.join(__dirname, 'uploads', 'processed')));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});