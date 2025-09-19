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
    this.embeddingModel = null; // Initialize as null
    this.initModel(); // Async model initialization
    this.loadEmbeddings();
  }

  async initModel() {
    try {
      console.log('Loading model: sentence-transformers/all-MiniLM-L6-v2');
      this.embeddingModel = await pipeline('feature-extraction', 'sentence-transformers/all-MiniLM-L6-v2', {
        device: 'cpu',
        dtype: 'fp32' // Explicitly set to match log
      });
      console.log('Model loaded successfully');
    } catch (error) {
      console.error('Failed to initialize model:', error.message);
      throw error;
    }
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

  async generateVideoEmbedding(video) {
    try {
      const videoText = this.createVideoText(video);
      console.log(`Generating embedding for video ${video.id} with text: ${videoText.substring(0, 50)}...`);
      
      if (!this.embeddingModel) {
        throw new Error('Embedding model not initialized');
      }
      
      const embeddingResult = await this.embeddingModel(videoText, { pooling: 'mean', normalize: true });
      const embedding = Array.from(embeddingResult.data);

      console.log(`Embedding generated for video ${video.id}, length: ${embedding.length}`);

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

  async generateBatchEmbeddings(videos, batchSize = 10) {
    console.log(`Generating embeddings for ${videos.length} videos...`);
    
    // Ensure model is initialized before processing
    if (!this.embeddingModel) {
      await this.initModel();
    }

    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      
      try {
        await Promise.all(batch.map(video => this.generateVideoEmbedding(video)));
        console.log(`Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videos.length / batchSize)}`);
        
        if ((i + batchSize) % 50 === 0) {
          await this.saveEmbeddings();
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Error processing batch starting at index ${i}:`, error);
      }
    }
    
    await this.saveEmbeddings();
    console.log('Finished generating embeddings');
  }

  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async semanticSearch(query, limit = 20, threshold = 0.7) {
    try {
      if (!this.embeddingModel) {
        throw new Error('Embedding model not initialized');
      }
      
      const queryEmbeddingResult = await this.embeddingModel(query.toLowerCase(), { pooling: 'mean', normalize: true });
      const queryEmbedding = Array.from(queryEmbeddingResult.data);
      const results = [];

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

      results.sort((a, b) => b.similarity - a.similarity);
      return results.slice(0, limit);
    } catch (error) {
      console.error('Error performing semantic search:', error);
      throw error;
    }
  }

  async hybridSearch(query, videos, semanticWeight = 0.7, keywordWeight = 0.3, limit = 20) {
    try {
      const semanticResults = await this.semanticSearch(query, videos.length);
      const semanticMap = new Map(semanticResults.map(r => [r.videoId, r.similarity]));

      const keywords = query.toLowerCase().split(' ');
      const keywordResults = videos.map(video => {
        const videoText = this.createVideoText(video).toLowerCase();
        let score = 0;
        
        keywords.forEach(keyword => {
          if (videoText.includes(keyword)) {
            score += 1;
          }
          
          if (video.title && video.title.toLowerCase().includes(keyword)) {
            score += 2;
          }
          
          if (video.category && video.category.toLowerCase().includes(keyword)) {
            score += 1.5;
          }
        });
        
        return {
          videoId: video.id,
          keywordScore: Math.min(score / keywords.length, 1)
        };
      });

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