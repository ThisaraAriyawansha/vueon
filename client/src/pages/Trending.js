import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Clock, Eye, Heart, Share2, Star, Search, Filter, X } from 'lucide-react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import backgroundImage from '../assets/images/360_F_1371820258_sX7EVDEKwtqsMD4uC93V8rubwKXqaAYx.jpg';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  const [timeFilter, setTimeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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
        setFilteredVideos(response.data);
        setLoading(false);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(response.data.map(video => video.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError('Failed to load trending videos');
        console.error('Error fetching trending videos:', error);
        setLoading(false);
      }
    };

    fetchTrendingVideos();
  }, []);

  // Filter videos based on search and filters
  useEffect(() => {
    let results = [...videos];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description.toLowerCase().includes(query) ||
        (video.tags && JSON.parse(video.tags).some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      results = results.filter(video => video.category === selectedCategory);
    }
    
    // Apply time filter (this would need createdAt field in your database)
    if (timeFilter !== 'all') {
      const now = new Date();
      let filterDate = new Date();
      
      if (timeFilter === 'today') {
        filterDate.setDate(now.getDate() - 1);
      } else if (timeFilter === 'week') {
        filterDate.setDate(now.getDate() - 7);
      } else if (timeFilter === 'month') {
        filterDate.setMonth(now.getMonth() - 1);
      }
      
      // This would require your videos to have a created_at field
      // results = results.filter(video => new Date(video.created_at) > filterDate);
    }
    
    // Apply sorting
    results.sort((a, b) => {
      if (sortBy === 'views') {
        return b.views - a.views;
      } else if (sortBy === 'likes') {
        return b.like_count - a.like_count;
      } else if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return 0;
    });
    
    setFilteredVideos(results);
  }, [videos, searchQuery, selectedCategory, sortBy, timeFilter]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('views');
    setTimeFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm">
                <Play className="w-6 h-6 text-gray-600" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-light text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
              Vueon
            </h2>
            <p className="max-w-md mb-8 text-center text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
              Loading trending content...
            </p>
            <div className="w-32 h-1 overflow-hidden bg-gray-200 rounded-full">
              <div className="h-full bg-gray-900 animate-pulse" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full shadow-sm bg-red-50">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-lg font-light text-center text-red-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>{error}</div>
            <p className="mt-2 text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div
        className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center text-center bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: isMobile ? 'center 30%' : `center ${scrollY * 0.5}px`,
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
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
        {/* Search and Filter Bar */}
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 mb-4 md:mb-0 md:max-w-md">
            <Search className="absolute w-5 h-5 text-gray-500 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="text"
              placeholder="Search trending videos..."
              className="w-full py-3 pl-10 pr-4 bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-gray-300 focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
              style={{ fontFamily: "'SF Pro Text', sans-serif" }}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white shadow-sm rounded-2xl md:hidden hover:bg-gray-100"
              onClick={() => setShowFilters(!showFilters)}
              style={{ fontFamily: "'SF Pro Text', sans-serif" }}
            >
              <Filter className="w-4 h-4 mr-2 text-gray-600" />
              Filters
            </button>
            
            <div className="items-center hidden space-x-2 md:flex">
              <select 
                className="px-4 py-2 text-sm bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-gray-300 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ fontFamily: "'SF Pro Text', sans-serif" }}
              >
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
                <option value="newest">Newest</option>
              </select>
              
              <select 
                className="px-4 py-2 text-sm bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-gray-300 focus:outline-none"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{ fontFamily: "'SF Pro Text', sans-serif" }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Filters Sidebar */}
          <div className={`w-full md:w-64 mb-6 md:mb-0 md:mr-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="p-6 bg-white shadow-sm rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                  Filters
                </h3>
                <button 
                  className="text-sm text-gray-600 hover:text-gray-900"
                  onClick={clearFilters}
                  style={{ fontFamily: "'SF Pro Text', sans-serif" }}
                >
                  Clear All
                </button>
              </div>
              
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-700" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Categories
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value="all"
                      checked={selectedCategory === 'all'}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 mr-2 text-gray-900 accent-gray-900"
                    />
                    <span style={{ fontFamily: "'SF Pro Text', sans-serif" }}>All Categories</span>
                  </label>
                  
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 mr-2 text-gray-900 accent-gray-900"
                      />
                      <span style={{ fontFamily: "'SF Pro Text', sans-serif" }}>{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="mb-3 font-medium text-gray-700" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Sort By
                </h4>
                <select 
                  className="w-full px-3 py-2 bg-white shadow-sm rounded-xl focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ fontFamily: "'SF Pro Text', sans-serif" }}
                >
                  <option value="views">Most Views</option>
                  <option value="likes">Most Likes</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
              
              <div>
                <h4 className="mb-3 font-medium text-gray-700" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Time Period
                </h4>
                <select 
                  className="w-full px-3 py-2 bg-white shadow-sm rounded-xl focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ fontFamily: "'SF Pro Text', sans-serif" }}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 gap-5 mb-12 md:grid-cols-3">
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Total Views</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <Play className="w-5 h-5 text-gray-600 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.length}
                    </h3>
                    <p className="text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Trending Videos</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                    <Heart className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.reduce((sum, video) => sum + video.like_count, 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Total Likes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                Showing {filteredVideos.length} of {videos.length} videos
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              </p>
            </div>

            {/* Videos Grid */}
            {filteredVideos.length === 0 ? (
              <div className="py-16 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full shadow-sm">
                  <Search className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                  No videos found
                </h3>
                <p className="text-gray-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Try adjusting your search or filters
                </p>
                <button 
                  className="px-4 py-2 mt-4 text-gray-900 bg-white shadow-sm rounded-xl hover:bg-gray-100"
                  onClick={clearFilters}
                  style={{ fontFamily: "'SF Pro Text', sans-serif" }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video, index) => (
                  <VideoCard key={video.id} video={video} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trending;