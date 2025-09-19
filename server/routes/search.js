const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Use shared EmbeddingService instance
router.use((req, res, next) => {
  req.embeddingService = req.app.get('embeddingService');
  if (!req.embeddingService) {
    console.error('EmbeddingService not initialized in app');
    return res.status(500).json({ success: false, error: 'EmbeddingService not available' });
  }
  next();
});

// Initialize embeddings for all videos
router.post('/initialize-embeddings', async (req, res) => {
  try {
    const query = `
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript
      FROM videos 
      WHERE status = 'published'
    `;
    console.log('Executing query for initialize-embeddings:', query);
    const result = await db.execute(query);
    
    console.log('Query result:', result);
    if (!result || !Array.isArray(result[0])) {
      throw new Error('Database query returned non-iterable result');
    }
    
    const videos = result[0];
    console.log(`Found ${videos.length} videos`);

    if (videos.length === 0) {
      return res.json({
        success: true,
        message: 'No published videos found to generate embeddings'
      });
    }

    await req.embeddingService.generateBatchEmbeddings(videos);
    
    res.json({ 
      success: true, 
      message: `Generated embeddings for ${videos.length} videos` 
    });
  } catch (error) {
    console.error('Error initializing embeddings:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize embeddings',
      details: error.message 
    });
  }
});

// Semantic search endpoint (GET)
router.get('/semantic', async (req, res) => {
  try {
    const { q: query, limit = 20, threshold = 0.7 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }

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
        total: 0
      });
    }

    const videoIds = searchResults.map(r => r.videoId);
    const placeholders = videoIds.map(() => '?').join(',');
    
    const queryStr = `
      SELECT v.*, u.username as creator_name, u.avatar as creator_avatar
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE v.id IN (${placeholders}) AND v.status = 'published'
    `;
    console.log('Executing query for semantic search:', queryStr, videoIds);
    const result = await db.execute(queryStr, videoIds);
    
    if (!result || !Array.isArray(result[0])) {
      throw new Error('Database query returned non-iterable result');
    }
    
    const videos = result[0];

    const resultsWithScores = searchResults.map(result => {
      const video = videos.find(v => v.id === result.videoId);
      if (video) {
        return {
          ...video,
          similarity_score: Math.round(result.similarity * 100) / 100,
          search_rank: searchResults.findIndex(r => r.videoId === result.videoId) + 1
        };
      }
      return null;
    }).filter(Boolean);

    res.json({
      success: true,
      results: resultsWithScores,
      query,
      total: resultsWithScores.length,
      search_type: 'semantic'
    });
  } catch (error) {
    console.error('Error performing semantic search:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed',
      details: error.message 
    });
  }
});

// Semantic search endpoint (POST)
router.post('/semantic', async (req, res) => {
  try {
    const { query, limit = 20, threshold = 0.7 } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }

    const results = await req.embeddingService.semanticSearch(query, limit, threshold);
    res.json({ 
      success: true, 
      results 
    });
  } catch (error) {
    console.error('Error in semantic search:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
});

// Hybrid search endpoint
router.get('/hybrid', async (req, res) => {
  try {
    const { 
      q: query, 
      limit = 20, 
      semantic_weight = 0.7, 
      keyword_weight = 0.3,
      category,
      sort_by = 'relevance'
    } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }

    let videosQuery = `
      SELECT v.*, u.username as creator_name, u.avatar as creator_avatar
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE v.status = 'published'
    `;
    
    const queryParams = [];
    
    if (category && category !== 'all') {
      videosQuery += ' AND v.category = ?';
      queryParams.push(category);
    }
    
    console.log('Executing query for hybrid search:', videosQuery, queryParams);
    const result = await db.execute(videosQuery, queryParams);
    
    if (!result || !Array.isArray(result[0])) {
      throw new Error('Database query returned non-iterable result');
    }
    
    const videos = result[0];
    console.log(`Found ${videos.length} videos for hybrid search`);

    if (videos.length === 0) {
      return res.json({
        success: true,
        results: [],
        query,
        total: 0,
        search_type: 'hybrid',
        weights: { semantic: parseFloat(semantic_weight), keyword: parseFloat(keyword_weight) }
      });
    }

    const searchResults = await req.embeddingService.hybridSearch(
      query.trim(),
      videos,
      parseFloat(semantic_weight),
      parseFloat(keyword_weight),
      parseInt(limit)
    );

    const resultsWithScores = searchResults.map(result => {
      const video = videos.find(v => v.id === result.videoId);
      if (video) {
        return {
          ...video,
          combined_score: Math.round(result.combinedScore * 100) / 100,
          semantic_score: Math.round(result.semanticScore * 100) / 100,
          keyword_score: Math.round(result.keywordScore * 100) / 100,
          search_rank: searchResults.findIndex(r => r.videoId === result.videoId) + 1
        };
      }
      return null;
    }).filter(Boolean);

    if (sort_by === 'views') {
      resultsWithScores.sort((a, b) => b.views - a.views);
    } else if (sort_by === 'likes') {
      resultsWithScores.sort((a, b) => b.like_count - a.like_count);
    } else if (sort_by === 'newest') {
      resultsWithScores.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    res.json({
      success: true,
      results: resultsWithScores,
      query,
      total: resultsWithScores.length,
      search_type: 'hybrid',
      weights: {
        semantic: parseFloat(semantic_weight),
        keyword: parseFloat(keyword_weight)
      }
    });
  } catch (error) {
    console.error('Error performing hybrid search:', error.message);
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
    
    const query = `
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript
      FROM videos 
      WHERE id = ? AND status = 'published'
    `;
    console.log('Executing query for update-embedding:', query, [videoId]);
    const result = await db.execute(query, [videoId]);
    
    if (!result || !Array.isArray(result[0])) {
      throw new Error('Database query returned non-iterable result');
    }
    
    const videos = result[0];
    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    await req.embeddingService.generateVideoEmbedding(videos[0]);
    await req.embeddingService.saveEmbeddings();
    
    res.json({
      success: true,
      message: `Updated embedding for video ${videoId}`
    });
  } catch (error) {
    console.error('Error updating video embedding:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update embedding',
      details: error.message
    });
  }
});

module.exports = router;