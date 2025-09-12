import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos/trending');
        setVideos(response.data);
      } catch (error) {
        setError('Failed to load trending videos');
        console.error('Error fetching trending videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-primary">Trending Videos</h1>
      
      {videos.length === 0 ? (
        <div className="text-center text-gray-500">
          No trending videos found
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map(video => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Trending;