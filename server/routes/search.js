const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Helper function to normalize database results
function normalizeDbResult(result) {
  if (!result) return [];
  
  // If it's already an array, return it
  if (Array.isArray(result)) {
    return result;
  }
  
  // If it's a single object, wrap in array
  if (result && typeof result === 'object') {
    return [result];
  }
  
  return [];
}

// Middleware to ensure EmbeddingService is available
router.use((req, res, next) => {
  req.embeddingService = req.app.get('embeddingService');
  if (!req.embeddingService) {
    console.error('EmbeddingService not initialized in app');
    return res.status(500).json({ success: false, error: 'EmbeddingService not available' });
  }
  next();
});

// Health check endpoint
router.get('/health', (req, res) => {
  try {
    const stats = req.embeddingService.getStats();
    res.json({
      success: true,
      ...stats,
      status: req.embeddingService.isReady() ? 'ready' : 'initializing'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed',
      details: error.message
    });
  }
});

// Initialize embeddings for all videos
router.post('/initialize-embeddings', async (req, res) => {
  try {
    console.log('Starting embedding initialization...');
    
    // Check if service is ready
    if (!req.embeddingService.isReady()) {
      console.log('Service not ready, waiting for initialization...');
      await req.embeddingService.init();
    }

    const query = `
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript, created_at, updated_at
      FROM videos 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    
    console.log('Executing database query...');
    const [rows] = await db.promise().query(query);
    const normalizedRows = normalizeDbResult(rows);
    
    console.log(`Normalized result: found ${normalizedRows.length} videos`);
    
    if (!normalizedRows || normalizedRows.length === 0) {
      return res.json({
        success: true,
        message: 'No published videos found to generate embeddings',
        count: 0
      });
    }

    console.log(`Processing ${normalizedRows.length} videos for embedding generation`);

    // Generate embeddings in batches
    await req.embeddingService.generateBatchEmbeddings(normalizedRows);
    
    res.json({ 
      success: true, 
      message: `Generated embeddings for ${normalizedRows.length} videos`,
      count: normalizedRows.length
    });
  } catch (error) {
    console.error('Error initializing embeddings:', error);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize embeddings',
      details: error.message 
    });
  }
});

// Semantic search endpoint (POST)
router.post('/semantic', async (req, res) => {
  try {
    const { query, limit = 20, threshold = 0.5 } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required and cannot be empty' 
      });
    }

    console.log(`Semantic search request: "${query}"`);

    // Ensure service is ready
    if (!req.embeddingService.isReady()) {
      await req.embeddingService.init();
    }

    // Perform semantic search
    const searchResults = await req.embeddingService.semanticSearch(
      query.trim(), 
      parseInt(limit), 
      parseFloat(threshold)
    );

    if (searchResults.length === 0) {
      return res.json({
        success: true,
        results: [],
        query,
        total: 0,
        message: 'No videos found matching your search criteria'
      });
    }

    // Get video details from database
    const videoIds = searchResults.map(r => r.videoId);
    const placeholders = videoIds.map(() => '?').join(',');
    
    const videoQuery = `
      SELECT v.*, u.username as creator_name, u.avatar as creator_avatar
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE v.id IN (${placeholders}) AND v.status = 'published'
    `;
    
    const [videoRows] = await db.promise().query(videoQuery, videoIds);
    const videoData = normalizeDbResult(videoRows);

    // Combine search results with video data
    const resultsWithDetails = searchResults.map(result => {
      const video = videoData.find(v => v.id === result.videoId);
      if (video) {
        return {
          ...video,
          similarity_score: result.similarity,
          search_rank: searchResults.findIndex(r => r.videoId === result.videoId) + 1
        };
      }
      return null;
    }).filter(Boolean);

    console.log(`Returning ${resultsWithDetails.length} semantic search results`);

    res.json({
      success: true,
      results: resultsWithDetails,
      query,
      total: resultsWithDetails.length,
      search_type: 'semantic',
      threshold
    });
  } catch (error) {
    console.error('Error in semantic search:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Semantic search failed',
      details: error.message 
    });
  }
});

// Semantic search endpoint (GET) - for compatibility
router.get('/semantic', async (req, res) => {
  try {
    const { q: query, limit = 20, threshold = 0.5 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter (q) is required' 
      });
    }

    // Forward to POST handler with body
    req.body = { query, limit: parseInt(limit), threshold: parseFloat(threshold) };
    
    // Call the POST semantic search handler
    return router.stack.find(layer => 
      layer.route?.path === '/semantic' && layer.route.methods.post
    ).route.stack[0].handle(req, res);
    
  } catch (error) {
    console.error('Error in GET semantic search:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

// Update embeddings for a specific video
router.post('/update-embedding/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    if (!videoId || isNaN(parseInt(videoId))) {
      return res.status(400).json({
        success: false,
        error: 'Valid video ID is required'
      });
    }

    // Ensure service is ready
    if (!req.embeddingService.isReady()) {
      await req.embeddingService.init();
    }
    
    const query = `
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript, created_at, updated_at
      FROM videos 
      WHERE id = ? AND status = 'published'
    `;
    
    const [rows] = await db.promise().query(query, [parseInt(videoId)]);
    const videoData = normalizeDbResult(rows);
    
    if (videoData.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found or not published'
      });
    }

    const video = videoData[0];
    await req.embeddingService.generateVideoEmbedding(video);
    await req.embeddingService.saveEmbeddings();
    
    res.json({
      success: true,
      message: `Updated embedding for video ${videoId}`,
      video: {
        id: video.id,
        title: video.title
      }
    });
  } catch (error) {
    console.error('Error updating video embedding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update embedding',
      details: error.message
    });
  }
});

// Get embedding statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = req.embeddingService.getStats();
    
    // Get total video count from database
    const countQuery = 'SELECT COUNT(*) as total FROM videos WHERE status = "published"';
    const [countRows] = await db.promise().query(countQuery);
    const countData = normalizeDbResult(countRows);
    const totalVideos = countData[0]?.total || 0;
    
    res.json({
      success: true,
      ...stats,
      totalVideos,
      coverage: totalVideos > 0 ? Math.round((stats.embeddingsCount / totalVideos) * 100) : 0
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      details: error.message
    });
  }
});

// Clear all embeddings (for debugging)
router.delete('/embeddings', async (req, res) => {
  try {
    req.embeddingService.videoEmbeddings.clear();
    await req.embeddingService.saveEmbeddings();
    
    res.json({
      success: true,
      message: 'All embeddings cleared'
    });
  } catch (error) {
    console.error('Error clearing embeddings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear embeddings',
      details: error.message
    });
  }
});

// Debug endpoint to check database connection and video data
router.get('/debug/videos', async (req, res) => {
  try {
    console.log('=== DATABASE DEBUG ===');
    
    // Test basic database connection
    const testQuery = 'SELECT 1 as test';
    const [testRows] = await db.promise().query(testQuery);
    console.log('Database connection test:', testRows);
    
    // Show all tables
    const tablesQuery = 'SHOW TABLES';
    const [tableRows] = await db.promise().query(tablesQuery);
    const tables = normalizeDbResult(tableRows);
    console.log('All tables in database:', tables);
    
    // Count all videos
    const countAllQuery = 'SELECT COUNT(*) as total FROM videos';
    const [countAllRows] = await db.promise().query(countAllQuery);
    const totalVideos = normalizeDbResult(countAllRows);
    console.log('Total videos count result:', totalVideos);
    
    // Count published videos
    const countPublishedQuery = 'SELECT COUNT(*) as total FROM videos WHERE status = ?';
    const [countPublishedRows] = await db.promise().query(countPublishedQuery, ['published']);
    const publishedVideos = normalizeDbResult(countPublishedRows);
    console.log('Published videos count result:', publishedVideos);
    
    // Get sample videos with all fields
    const sampleQuery = 'SELECT id, title, status, user_id, created_at FROM videos LIMIT 5';
    const [sampleRows] = await db.promise().query(sampleQuery);
    const samples = normalizeDbResult(sampleRows);
    console.log('Sample videos:', samples);
    
    // Get distinct statuses
    const statusQuery = 'SELECT DISTINCT status, COUNT(*) as count FROM videos GROUP BY status';
    const [statusRows] = await db.promise().query(statusQuery);
    const statuses = normalizeDbResult(statusRows);
    console.log('Video statuses:', statuses);
    
    // Test the exact query used by initialize-embeddings
    const embedQuery = `
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript, created_at, updated_at
      FROM videos 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    const [embedRows] = await db.promise().query(embedQuery);
    const embedResults = normalizeDbResult(embedRows);
    console.log('Embed query result count:', embedResults.length);
    
    res.json({
      success: true,
      debug: {
        databaseConnected: true,
        totalVideos: totalVideos[0]?.total || 0,
        publishedVideos: publishedVideos[0]?.total || 0,
        sampleVideos: samples,
        videoStatuses: statuses,
        embedQueryResultCount: embedResults.length,
        sampleEmbedResults: embedResults.slice(0, 3),
        allTables: tables
      }
    });
    
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;