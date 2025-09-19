const { pipeline } = require('@huggingface/transformers');
const fs = require('fs').promises;
const path = require('path');

let instance = null;

class EmbeddingService {
  constructor() {
    if (instance) {
      console.log('Returning existing EmbeddingService instance');
      return instance;
    }
    instance = this;
    console.log('Creating new EmbeddingService instance');
    this.embeddingsFile = path.join(__dirname, '../data/video_embeddings.json');
    this.videoEmbeddings = new Map();
    this.embeddingModel = null;
    this.modelInitialized = false;
    this.initPromise = null; // Track initialization promise
    this.init(); // Start initialization
  }

  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.initializeService();
    return this.initPromise;
  }

  async initializeService() {
    try {
      await this.initModel();
      await this.loadEmbeddings();
      console.log('EmbeddingService fully initialized');
    } catch (error) {
      console.error('Failed to initialize EmbeddingService:', error);
      throw error;
    }
  }

  async initModel() {
    try {
      console.log('Loading model: sentence-transformers/all-MiniLM-L6-v2');
      this.embeddingModel = await pipeline(
        'feature-extraction', 
        'sentence-transformers/all-MiniLM-L6-v2',
        {
          device: 'cpu',
          dtype: 'fp32',
          pooling: 'mean',
          normalize: true
        }
      );
      this.modelInitialized = true;
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to initialize model:', error.message);
      this.modelInitialized = false;
      throw error;
    }
  }

  async ensureModelReady() {
    if (!this.modelInitialized) {
      await this.init();
    }
    if (!this.embeddingModel) {
      throw new Error('Embedding model not available');
    }
  }

  async loadEmbeddings() {
    try {
      // Ensure data directory exists
      const dataDir = path.dirname(this.embeddingsFile);
      await fs.mkdir(dataDir, { recursive: true });

      const data = await fs.readFile(this.embeddingsFile, 'utf8');
      const embeddings = JSON.parse(data);
      
      // Convert to Map and ensure proper data structure
      this.videoEmbeddings = new Map();
      Object.entries(embeddings).forEach(([videoId, data]) => {
        if (data && Array.isArray(data.embedding)) {
          this.videoEmbeddings.set(videoId, data);
        }
      });
      
      console.log(`Loaded ${this.videoEmbeddings.size} video embeddings`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('No existing embeddings file found, starting fresh');
        this.videoEmbeddings = new Map();
      } else {
        console.error('Error loading embeddings:', error);
        this.videoEmbeddings = new Map();
      }
    }
  }

  async saveEmbeddings() {
    try {
      const dataDir = path.dirname(this.embeddingsFile);
      await fs.mkdir(dataDir, { recursive: true });
      
      const embeddingsObj = Object.fromEntries(this.videoEmbeddings);
      await fs.writeFile(this.embeddingsFile, JSON.stringify(embeddingsObj, null, 2));
      console.log(`Saved ${this.videoEmbeddings.size} embeddings to file`);
    } catch (error) {
      console.error('Error saving embeddings:', error);
    }
  }

  createVideoText(video) {
    const parts = [];
    
    // Add title with higher weight
    if (video.title) {
      parts.push(video.title);
      parts.push(video.title); // Add twice for importance
    }
    
    // Add description
    if (video.description) {
      parts.push(video.description);
    }
    
    // Add category
    if (video.category) {
      parts.push(`Category: ${video.category}`);
    }
    
    // Add tags
    if (video.tags) {
      try {
        const tags = typeof video.tags === 'string' ? JSON.parse(video.tags) : video.tags;
        if (Array.isArray(tags)) {
          parts.push(`Tags: ${tags.join(' ')}`);
        }
      } catch (e) {
        console.warn('Failed to parse tags for video', video.id);
      }
    }
    
    // Add transcript if available
    if (video.transcript) {
      parts.push(video.transcript);
    }
    
    // Add metadata
    if (video.duration) {
      parts.push(`Duration: ${video.duration} seconds`);
    }
    
    if (video.views) {
      parts.push(`Popular video with ${video.views} views`);
    }

    const text = parts.filter(Boolean).join(' ').toLowerCase().trim();
    return text || 'untitled video'; // Fallback for empty content
  }

  async generateVideoEmbedding(video) {
    try {
      await this.ensureModelReady();
      
      const videoText = this.createVideoText(video);
      console.log(`Generating embedding for video ${video.id}: "${videoText.substring(0, 100)}..."`);
      
      if (!videoText || videoText.trim().length === 0) {
        throw new Error('Empty video text for embedding generation');
      }

      // Generate embedding with proper options
      const embeddingResult = await this.embeddingModel(videoText, {
        pooling: 'mean',
        normalize: true
      });

      // Extract embedding data properly
      let embedding;
      if (embeddingResult && embeddingResult.data) {
        embedding = Array.from(embeddingResult.data);
      } else if (Array.isArray(embeddingResult)) {
        embedding = embeddingResult;
      } else {
        throw new Error('Unexpected embedding result format');
      }

      if (!embedding || embedding.length === 0) {
        throw new Error('Generated embedding is empty');
      }

      console.log(`Embedding generated for video ${video.id}, length: ${embedding.length}`);

      // Store embedding with metadata
      this.videoEmbeddings.set(video.id.toString(), {
        embedding,
        metadata: {
          title: video.title,
          category: video.category,
          views: video.views || 0,
          like_count: video.like_count || 0,
          updated_at: new Date().toISOString()
        }
      });

      return embedding;
    } catch (error) {
      console.error(`Error generating embedding for video ${video.id}:`, error);
      throw error;
    }
  }

  async generateBatchEmbeddings(videos, batchSize = 5) {
    if (!videos || videos.length === 0) {
      console.log('No videos provided for embedding generation');
      return;
    }

    console.log(`Generating embeddings for ${videos.length} videos...`);
    
    await this.ensureModelReady();

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (video) => {
        try {
          // Skip if embedding already exists and is recent
          const existingEmbedding = this.videoEmbeddings.get(video.id.toString());
          if (existingEmbedding && existingEmbedding.metadata?.updated_at) {
            const updateTime = new Date(existingEmbedding.metadata.updated_at);
            const videoUpdateTime = video.updated_at ? new Date(video.updated_at) : new Date(0);
            if (updateTime > videoUpdateTime) {
              console.log(`Skipping video ${video.id} - embedding is up to date`);
              return;
            }
          }

          await this.generateVideoEmbedding(video);
          successCount++;
        } catch (error) {
          console.error(`Failed to generate embedding for video ${video.id}:`, error.message);
          errorCount++;
        }
      });

      await Promise.all(batchPromises);
      
      console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videos.length / batchSize)} (${successCount} success, ${errorCount} errors)`);
      
      // Save periodically
      if ((i + batchSize) % 20 === 0) {
        await this.saveEmbeddings();
      }
      
      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    await this.saveEmbeddings();
    console.log(`Finished generating embeddings: ${successCount} successful, ${errorCount} failed`);
  }

  cosineSimilarity(vecA, vecB) {
    if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
      console.error('Invalid vectors for similarity calculation');
      return 0;
    }

    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async semanticSearch(query, limit = 20, threshold = 0.5) {
    try {
      await this.ensureModelReady();
      
      if (!query || query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      console.log(`Performing semantic search for: "${query}"`);
      console.log(`Available embeddings: ${this.videoEmbeddings.size}`);

      if (this.videoEmbeddings.size === 0) {
        console.warn('No embeddings available for search');
        return [];
      }

      // Generate query embedding
      const queryEmbeddingResult = await this.embeddingModel(query.toLowerCase().trim(), {
        pooling: 'mean',
        normalize: true
      });

      let queryEmbedding;
      if (queryEmbeddingResult && queryEmbeddingResult.data) {
        queryEmbedding = Array.from(queryEmbeddingResult.data);
      } else if (Array.isArray(queryEmbeddingResult)) {
        queryEmbedding = queryEmbeddingResult;
      } else {
        throw new Error('Failed to generate query embedding');
      }

      const results = [];

      // Calculate similarities
      for (const [videoId, videoData] of this.videoEmbeddings) {
        if (!videoData.embedding || !Array.isArray(videoData.embedding)) {
          console.warn(`Invalid embedding for video ${videoId}`);
          continue;
        }

        const similarity = this.cosineSimilarity(queryEmbedding, videoData.embedding);
        
        if (similarity >= threshold) {
          results.push({
            videoId: parseInt(videoId),
            similarity: Math.round(similarity * 1000) / 1000, // Round to 3 decimal places
            metadata: videoData.metadata
          });
        }
      }

      // Sort by similarity (highest first)
      results.sort((a, b) => b.similarity - a.similarity);
      
      const limitedResults = results.slice(0, limit);
      console.log(`Found ${limitedResults.length} results above threshold ${threshold}`);
      
      return limitedResults;
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  }

  keywordScore(text, keywords) {
    if (!text || !keywords || keywords.length === 0) return 0;
    
    const textLower = text.toLowerCase();
    let score = 0;
    let totalMatches = 0;
    
    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      if (textLower.includes(keywordLower)) {
        totalMatches++;
        // Bonus for exact word matches vs substring matches
        const wordRegex = new RegExp(`\\b${keywordLower}\\b`, 'i');
        if (wordRegex.test(text)) {
          score += 2;
        } else {
          score += 1;
        }
      }
    });
    
    // Normalize by number of keywords
    return keywords.length > 0 ? (score / (keywords.length * 2)) : 0;
  }

  async hybridSearch(query, videos, semanticWeight = 0.7, keywordWeight = 0.3, limit = 20) {
    try {
      console.log(`Performing hybrid search for: "${query}"`);
      console.log(`Weights - Semantic: ${semanticWeight}, Keyword: ${keywordWeight}`);

      // Get semantic results
      const semanticResults = await this.semanticSearch(query, videos.length, 0.1); // Lower threshold for hybrid
      const semanticMap = new Map(semanticResults.map(r => [r.videoId, r.similarity]));

      // Prepare keywords
      const keywords = query.toLowerCase().trim().split(/\s+/).filter(k => k.length > 2);
      console.log(`Keywords: ${keywords.join(', ')}`);

      // Calculate hybrid scores
      const hybridResults = videos.map(video => {
        const semanticScore = semanticMap.get(video.id) || 0;
        
        // Calculate keyword score
        const videoText = this.createVideoText(video);
        const titleScore = this.keywordScore(video.title || '', keywords) * 2; // Title gets double weight
        const descriptionScore = this.keywordScore(video.description || '', keywords);
        const categoryScore = this.keywordScore(video.category || '', keywords) * 1.5;
        const tagScore = video.tags ? this.keywordScore(video.tags, keywords) : 0;
        
        const keywordScore = Math.min((titleScore + descriptionScore + categoryScore + tagScore) / 4, 1);
        
        // Combine scores
        const combinedScore = (semanticScore * semanticWeight) + (keywordScore * keywordWeight);
        
        return {
          videoId: video.id,
          combinedScore,
          semanticScore,
          keywordScore
        };
      });

      // Filter and sort results
      const filteredResults = hybridResults
        .filter(r => r.combinedScore > 0.1) // Minimum threshold
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);

      console.log(`Hybrid search found ${filteredResults.length} results`);
      return filteredResults;
    } catch (error) {
      console.error('Error performing hybrid search:', error);
      throw error;
    }
  }

  // Health check method
  isReady() {
    return this.modelInitialized && this.embeddingModel !== null;
  }

  getStats() {
    return {
      modelInitialized: this.modelInitialized,
      embeddingsCount: this.videoEmbeddings.size,
      embeddingsFile: this.embeddingsFile
    };
  }
}

module.exports = EmbeddingService;