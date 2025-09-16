import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        setError('Failed to load videos');
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-[#0077b6]"></div>
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
    <div className="bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Latest Videos Section */}
      <div className="container px-4 py-16 mx-auto">
        <h1 className="mb-8 text-4xl font-bold text-[#003366] text-center md:text-left">Latest Videos</h1>
        {videos.length === 0 ? (
          <div className="text-center text-gray-500">No videos found. Be the first to upload!</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-[#003366] text-white py-16">
        <div className="container px-4 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center md:text-4xl">Why Choose Vueon?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center p-6 bg-[#005691] rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="mb-2 text-xl font-semibold">Seamless Streaming</h3>
              <p className="text-[#add8e6]">Stream high-quality videos with minimal buffering and maximum performance.</p>
            </div>
            <div className="text-center p-6 bg-[#005691] rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="mb-2 text-xl font-semibold">Easy Sharing</h3>
              <p className="text-[#add8e6]">Share your videos with the world in just a few clicks.</p>
            </div>
            <div className="text-center p-6 bg-[#005691] rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="mb-2 text-xl font-semibold">Creator Tools</h3>
              <p className="text-[#add8e6]">Powerful editing and analytics tools to grow your audience.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-gradient-to-b from-[#005691] to-[#0077b6] text-white py-16 text-center">
        <div className="container px-4 mx-auto">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Share Your Story?</h2>
          <p className="text-lg mb-8 text-[#add8e6] max-w-2xl mx-auto">
            Join Vueon today and start uploading your videos to inspire, entertain, and connect.
          </p>
          <button className="bg-white text-[#003366] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#add8e6] transition-all duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;