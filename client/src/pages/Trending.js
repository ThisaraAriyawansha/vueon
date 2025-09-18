import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Clock, Eye, Heart, Share2, Star } from 'lucide-react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import backgroundImage from '../assets/images/360_F_1371820258_sX7EVDEKwtqsMD4uC93V8rubwKXqaAYx.jpg';


const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Detect mobile based on screen width

  // Handle window resize to update isMobile state
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set animation visibility after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible({
        'animate-overlay': true,
        'animate-subtitle': true,
        'animate-divider': true,
        'animate-title': true,
        'animate-description': true
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchTrendingVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos/trending');
        setVideos(response.data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load trending videos');
        console.error('Error fetching trending videos:', error);
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            {/* Minimal loading animation */}
            <div className="relative mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
                <Play className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Vueon
            </h2>
            <p className="max-w-md mb-8 text-center text-gray-500">
              Loading trending content...
            </p>
            
            {/* Simple loading indicator */}
            <div className="w-32 h-1 overflow-hidden bg-gray-200 rounded-full">
              <div className="h-full bg-blue-500 animate-pulse" style={{width: '30%'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-red-50">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-lg font-medium text-center text-red-600">{error}</div>
            <p className="mt-2 text-gray-500">Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Apple style with subtle gradient */}
<div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', // Ensure image covers the section
          backgroundPosition: isMobile ? 'center 30%' : `center ${scrollY * 0.5}px`, // Adjust position for mobile
          backgroundAttachment: isMobile ? 'scroll' : 'fixed', // Scroll for mobile, fixed for desktop
        }}
      >
        {/* Animated overlay */}
        <div 
          className="absolute inset-0 bg-black/30"
          id="animate-overlay"
          style={{
            transition: 'opacity 1.2s ease-out',
            opacity: isVisible['animate-overlay'] ? 1 : 0
          }}
        ></div>

        <div className="relative z-10 max-w-4xl px-6 mx-auto mt-8">
          <div className="space-y-6">
            {/* Subtitle with fade-in and slide-up */}
            <p
              id="animate-subtitle"
              className="text-sm font-medium tracking-wider text-white uppercase md:text-base opacity-90"
              style={{
                transition: 'all 0.8s ease-out',
                opacity: isVisible['animate-subtitle'] ? 1 : 0,
                transform: isVisible['animate-subtitle'] ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              Discover What's Hot
            </p>
            
            {/* Animated divider line */}
            <div 
              id="animate-divider"
              className="w-16 h-px mx-auto bg-white/40"
              style={{
                transition: 'all 1s ease-out 0.3s',
                opacity: isVisible['animate-divider'] ? 1 : 0,
                transform: isVisible['animate-divider'] ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center'
              }}
            ></div>
            
            {/* Main title with staggered animation */}
            <h1
              id="animate-title"
              className="text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{
                transition: 'all 1s ease-out 0.6s',
                opacity: isVisible['animate-title'] ? 1 : 0,
                transform: isVisible['animate-title'] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)'
              }}
            >
              Trending Videos
            </h1>
            
            {/* Description text with fade-in */}
            <p
              id="animate-description"
              className="max-w-2xl mx-auto text-lg font-light text-white md:text-xl opacity-95"
              style={{
                transition: 'all 1s ease-out 0.9s',
                opacity: isVisible['animate-description'] ? 1 : 0,
                transform: isVisible['animate-description'] ? 'translateY(0)' : 'translateY(20px)'
              }}
            >
              Explore the most popular videos trending right now. Stay updated with the latest content that's capturing everyone's attention.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-6 py-12 mx-auto">
        {/* Stats Bar - Simplified */}
        <div className="grid grid-cols-1 gap-5 mb-12 md:grid-cols-3">
          <div className="p-5 transition-colors duration-200 bg-gray-50 rounded-xl hover:bg-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <TrendingUp className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">12.5M+</h3>
                <p className="text-gray-600">Total Views Today</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 transition-colors duration-200 bg-gray-50 rounded-xl hover:bg-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Play className="w-5 h-5 text-gray-700 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">2.1K+</h3>
                <p className="text-gray-600">Trending Videos</p>
              </div>
            </div>
          </div>
          
          <div className="p-5 transition-colors duration-200 bg-gray-50 rounded-xl hover:bg-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Heart className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">890K+</h3>
                <p className="text-gray-600">Likes This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full">
              <Play className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-600">No trending videos found</h3>
            <p className="text-gray-500">Check back later for the latest trending content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video, index) => (
              <VideoCard key={video.id} video={video} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;