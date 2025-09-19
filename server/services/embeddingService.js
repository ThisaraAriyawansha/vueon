// backend/services/embeddingService.js
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

class EmbeddingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.embeddingsFile = path.join(__dirname, '../data/video_embeddings.json');
    this.videoEmbeddings = new Map();
    this.loadEmbeddings();
  }

  async loadEmbeddings() {
    try {
      const data = await fs.readFile(this.embeddingsFile, 'utf8');
      const embeddings = JSON.parse(data);
      this.videoEmbeddings = new Map(Object.entries(embeddings));
      console.log(`Loaded ${this.videoEmbeddings.size} video embeddings`);
    } catch (error) {
      console.log('No existing embeddings file found, starting fresh');
      this.videoEmbeddings = new Map();
    }
  }

  async saveEmbeddings() {
    try {
      const embeddingsObj = Object.fromEntries(this.videoEmbeddings);
      await fs.writeFile(this.embeddingsFile, JSON.stringify(embeddingsObj, null, 2));
    } catch (error) {
      console.error('Error saving embeddings:', error);
    }
  }

  // Create searchable text from video metadata
  createVideoText(video) {
    const parts = [
      video.title || '',
      video.description || '',
      video.category || '',
      video.transcript || '',
      video.tags ? JSON.parse(video.tags).join(' ') : '',
      video.duration ? `duration: ${video.duration}` : '',
      video.views ? `popular with ${video.views} views` : '',
    ].filter(Boolean);

    return parts.join(' ').toLowerCase();
  }

  // Generate embeddings for a single video
  async generateVideoEmbedding(video) {
    try {
      const videoText = this.createVideoText(video);
      
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small', // More cost-effective
        input: videoText,
        encoding_format: 'float',
      });

      const embedding = response.data[0].embedding;
      this.videoEmbeddings.set(video.id.toString(), {
        embedding,
        metadata: {
          title: video.title,
          category: video.category,
          views: video.views,
          like_count: video.like_count,
          updated_at: new Date().toISOString()
        }
      });

      return embedding;
    } catch (error) {
      console.error(`Error generating embedding for video ${video.id}:`, error);
      throw error;
    }
  }

  // Generate embeddings for multiple videos
  async generateBatchEmbeddings(videos, batchSize = 10) {
    console.log(`Generating embeddings for ${videos.length} videos...`);
    
    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      
      try {
        await Promise.all(batch.map(video => this.generateVideoEmbedding(video)));
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videos.length / batchSize)}`);
        
        // Save periodically
        if ((i + batchSize) % 50 === 0) {
          await this.saveEmbeddings();
        }
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing batch starting at index ${i}:`, error);
      }
    }
    
    await this.saveEmbeddings();
    console.log('Finished generating embeddings');
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  // Perform semantic search
  async semanticSearch(query, limit = 20, threshold = 0.7) {
    try {
      // Generate embedding for search query
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: query.toLowerCase(),
        encoding_format: 'float',
      });

      const queryEmbedding = response.data[0].embedding;
      const results = [];

      // Calculate similarities with all video embeddings
      for (const [videoId, videoData] of this.videoEmbeddings) {
        const similarity = this.cosineSimilarity(queryEmbedding, videoData.embedding);
        
        if (similarity >= threshold) {
          results.push({
            videoId: parseInt(videoId),
            similarity,
            metadata: videoData.metadata
          });
        }
      }

      // Sort by similarity score (highest first)
      results.sort((a, b) => b.similarity - a.similarity);
      
      return results.slice(0, limit);
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  }

  // Hybrid search combining keyword and semantic search
  async hybridSearch(query, videos, semanticWeight = 0.7, keywordWeight = 0.3, limit = 20) {
    try {
      // Perform semantic search
      const semanticResults = await this.semanticSearch(query, videos.length);
      const semanticMap = new Map(semanticResults.map(r => [r.videoId, r.similarity]));

      // Perform keyword search
      const keywords = query.toLowerCase().split(' ');
      const keywordResults = videos.map(video => {
        const videoText = this.createVideoText(video).toLowerCase();
        let score = 0;
        
        keywords.forEach(keyword => {
          // Exact match bonus
          if (videoText.includes(keyword)) {
            score += 1;
          }
          
          // Title match bonus
          if (video.title && video.title.toLowerCase().includes(keyword)) {
            score += 2;
          }
          
          // Category match bonus
          if (video.category && video.category.toLowerCase().includes(keyword)) {
            score += 1.5;
          }
        });
        
        return {
          videoId: video.id,
          keywordScore: Math.min(score / keywords.length, 1) // Normalize to 0-1
        };
      });

      // Combine scores
      const hybridResults = keywordResults.map(result => {
        const semanticScore = semanticMap.get(result.videoId) || 0;
        const combinedScore = (semanticScore * semanticWeight) + (result.keywordScore * keywordWeight);
        
        return {
          videoId: result.videoId,
          combinedScore,
          semanticScore,
          keywordScore: result.keywordScore
        };
      });

      // Sort by combined score and filter by minimum threshold
      const filteredResults = hybridResults
        .filter(r => r.combinedScore > 0.3)
        .sort((a, b) => b.combinedScore - a.combinedScore)
        .slice(0, limit);

      return filteredResults;
    } catch (error) {
      console.error('Error performing hybrid search:', error);
      throw error;
    }
  }
}

module.exports = EmbeddingService;