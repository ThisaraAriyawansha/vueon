// backend/routes/search.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');
const EmbeddingService = require('../services/embeddingService');

const embeddingService = new EmbeddingService();

// Initialize embeddings for all videos
router.post('/initialize-embeddings', async (req, res) => {
  try {
    const [videos] = await db.execute(`
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript
      FROM videos 
      WHERE status = 'published'
    `);

    await embeddingService.generateBatchEmbeddings(videos);
    
    res.json({ 
      success: true, 
      message: `Generated embeddings for ${videos.length} videos` 
    });
  } catch (error) {
    console.error('Error initializing embeddings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to initialize embeddings' 
    });
  }
});

// Semantic search endpoint
router.get('/semantic', async (req, res) => {
  try {
    const { q: query, limit = 20, threshold = 0.7 } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Query parameter is required' 
      });
    }

    // Perform semantic search
    const searchResults = await embeddingService.semanticSearch(
      query.trim(), 
      parseInt(limit), 
      parseFloat(threshold)
    );

    // Get full video details for matching videos
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
    
    const [videos] = await db.execute(`
      SELECT v.*, u.username as creator_name, u.avatar as creator_avatar
      FROM videos v
      LEFT JOIN users u ON v.user_id = u.id
      WHERE v.id IN (${placeholders}) AND v.status = 'published'
    `, videoIds);

    // Combine video details with similarity scores
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
    console.error('Error performing semantic search:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed' 
    });
  }
});


// Semantic search endpoint
router.post('/semantic', async (req, res) => {
  try {
    const { query, limit = 20, threshold = 0.7 } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const results = await embeddingService.semanticSearch(query, limit, threshold);
    res.json({ results });
  } catch (error) {
    console.error('Error in semantic search:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    // Get all videos for hybrid search
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
    
    const [videos] = await db.execute(videosQuery, queryParams);

    // Perform hybrid search
    const searchResults = await embeddingService.hybridSearch(
      query.trim(),
      videos,
      parseFloat(semantic_weight),
      parseFloat(keyword_weight),
      parseInt(limit)
    );

    // Get matching videos with scores
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

    // Apply additional sorting if requested
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
    console.error('Error performing hybrid search:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Search failed' 
    });
  }
});

// Update embeddings for a specific video
router.post('/update-embedding/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const [videos] = await db.execute(`
      SELECT id, title, description, category, tags, views, like_count, 
             duration, transcript
      FROM videos 
      WHERE id = ? AND status = 'published'
    `, [videoId]);

    if (videos.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    await embeddingService.generateVideoEmbedding(videos[0]);
    await embeddingService.saveEmbeddings();
    
    res.json({
      success: true,
      message: `Updated embedding for video ${videoId}`
    });

  } catch (error) {
    console.error('Error updating video embedding:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update embedding'
    });
  }
});

module.exports = router;