import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, Heart, Search, Filter, Sparkles, Bot, X, Clock, Zap, Brain } from 'lucide-react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import backgroundImage from '../assets/images/360_F_1371820258_sX7EVDEKwtqsMD4uC93V8rubwKXqaAYx.jpg';

const Trending = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [isVisible, setIsVisible] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('views');
  const [timeFilter, setTimeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchType, setSearchType] = useState('semantic'); // Default to semantic
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

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

  // Generate AI suggestions based on current query
  const generateSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      // In a real app, you would call an API endpoint for suggestions
      // For now, we'll simulate it with some intelligent suggestions
      const mockSuggestions = [
        { type: 'semantic', text: `Find videos similar to "${query}"` },
        { type: 'category', text: `Search in ${selectedCategory !== 'all' ? selectedCategory : 'all categories'}` },
        { type: 'concept', text: `Explore concepts related to "${query}"` },
        { type: 'trending', text: `Show trending videos about "${query}"` },
      ];
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    }
  };

  // Add query to search history
  const addToSearchHistory = (query) => {
    if (!query.trim()) return;
    
    const updatedHistory = [
      query,
      ...searchHistory.filter(item => item !== query).slice(0, 4) // Keep only 5 recent items
    ];
    
    setSearchHistory(updatedHistory);
  };

  // Perform semantic search
  const performSemanticSearch = async (query) => {
    try {
      setSearchLoading(true);
      const response = await axios.post('http://localhost:5000/api/search/semantic', {
        query,
        limit: 50,
        threshold: 0.5
      });
      
      // Get video IDs from semantic search results
      const videoIds = response.data.results.map(result => result.videoId);
      
      // Filter videos based on semantic search results
      const semanticVideos = videos.filter(video => 
        videoIds.includes(video.id)
      );
      
      // Sort by the order of relevance from semantic search
      semanticVideos.sort((a, b) => {
        return videoIds.indexOf(a.id) - videoIds.indexOf(b.id);
      });
      
      setFilteredVideos(semanticVideos);
      addToSearchHistory(query);
    } catch (error) {
      console.error('Error performing semantic search:', error);
      // Fall back to keyword search if semantic search fails
      performKeywordSearch(query);
    } finally {
      setSearchLoading(false);
    }
  };

  // Perform keyword search (original functionality)
  const performKeywordSearch = (query) => {
    const queryLower = query.toLowerCase();
    const results = videos.filter(video => 
      video.title.toLowerCase().includes(queryLower) || 
      video.description.toLowerCase().includes(queryLower) ||
      (video.tags && JSON.parse(video.tags).some(tag => tag.toLowerCase().includes(queryLower)))
    );
    
    setFilteredVideos(results);
    addToSearchHistory(query);
  };

  // Handle search input with debounce
  useEffect(() => {
    if (!searchQuery) {
      // If search query is empty, show all videos with current filters
      applyFiltersToVideos(videos);
      setSuggestions([]);
      return;
    }

    generateSuggestions(searchQuery);

    const delayDebounceFn = setTimeout(() => {
      if (searchType === 'semantic') {
        performSemanticSearch(searchQuery);
      } else {
        performKeywordSearch(searchQuery);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, searchType]);

  // Apply filters to videos
  const applyFiltersToVideos = (videosToFilter) => {
    let results = [...videosToFilter];
    
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
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchType === 'semantic') {
        performSemanticSearch(searchQuery);
      } else {
        performKeywordSearch(searchQuery);
      }
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    applyFiltersToVideos(videos);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('views');
    setTimeFilter('all');
    setSearchType('semantic');
    setShowSuggestions(false);
  };

  const toggleSearchType = () => {
    setSearchType(prevType => {
      const newType = prevType === 'keyword' ? 'semantic' : 'keyword';
      
      // If there's a search query, re-run search with new type
      if (searchQuery) {
        if (newType === 'semantic') {
          performSemanticSearch(searchQuery);
        } else {
          performKeywordSearch(searchQuery);
        }
      }
      
      return newType;
    });
  };

  // Update filtered videos when filters change (excluding search)
  useEffect(() => {
    if (!searchQuery) {
      applyFiltersToVideos(videos);
    }
  }, [selectedCategory, sortBy, timeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative mb-8">
              <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm">
                <Play className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h2 className="mb-4 text-2xl font-light text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
              Vueon
            </h2>
            <p className="max-w-md mb-8 text-center text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
              Loading trending content...
            </p>
            <div className="w-32 h-1 overflow-hidden bg-gray-200 rounded-full">
              <div className="h-full bg-blue-600 animate-pulse" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="container px-6 py-12 mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-red-100 rounded-full shadow-sm">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
            </div>
            <div className="text-lg font-light text-center text-red-500" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>{error}</div>
            <p className="mt-2 text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Please try again later</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"
          id="animate-overlay"
          style={{
            transition: 'opacity 1.2s ease-out',
            opacity: isVisible['animate-overlay'] ? 1 : 0
          }}
        ></div>

        <div className="relative z-10 max-w-4xl px-6 mx-auto mt-8">
          <div className="space-y-6">
            <p
              id="animate-subtitle"
              className="text-sm font-medium tracking-widest text-white uppercase opacity-80"
              style={{
                transition: 'all 0.8s ease-out',
                opacity: isVisible['animate-subtitle'] ? 1 : 0,
                transform: isVisible['animate-subtitle'] ? 'translateY(0)' : 'translateY(20px)',
                fontFamily: "'SF Pro Text', sans-serif"
              }}
            >
              Discover What's Hot
            </p>
            
            <div 
              id="animate-divider"
              className="w-12 h-px mx-auto bg-blue-400/50"
              style={{
                transition: 'all 1s ease-out 0.3s',
                opacity: isVisible['animate-divider'] ? 1 : 0,
                transform: isVisible['animate-divider'] ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'center'
              }}
            ></div>
            
            <h1
              id="animate-title"
              className="text-4xl font-light tracking-tight text-white md:text-5xl lg:text-6xl"
              style={{
                transition: 'all 1s ease-out 0.6s',
                opacity: isVisible['animate-title'] ? 1 : 0,
                transform: isVisible['animate-title'] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                fontFamily: "'SF Pro Display', sans-serif"
              }}
            >
              Trending Videos
            </h1>
            
            <p
              id="animate-description"
              className="max-w-2xl mx-auto text-lg font-light text-white/90"
              style={{
                transition: 'all 1s ease-out 0.9s',
                opacity: isVisible['animate-description'] ? 1 : 0,
                transform: isVisible['animate-description'] ? 'translateY(0)' : 'translateY(20px)',
                fontFamily: "'SF Pro Text', sans-serif"
              }}
            >
              Explore the most popular videos trending right now. Stay updated with the latest content that's capturing everyone's attention.
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-6 py-12 mx-auto">
        {/* AI Search Bar */}
        <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 mb-4 md:mb-0 md:max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="absolute left-0 flex items-center h-full pl-4">
                {searchLoading ? (
                  <div className="w-5 h-5 border-t-2 border-blue-600 border-solid rounded-full animate-spin"></div>
                ) : (
                  <Search className="w-5 h-5 text-blue-600" />
                )}
              </div>
              
              <input
                type="text"
                placeholder="Ask AI to find videos... (e.g. 'funny cat videos' or 'educational content')"
                className="w-full py-3 pl-12 pr-12 bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => {
                  setIsSearchFocused(true);
                  setShowSuggestions(true);
                }}
                onBlur={() => {
                  setTimeout(() => setIsSearchFocused(false), 200);
                }}
                style={{ fontFamily: "'SF Pro Text', sans-serif" }}
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute transform -translate-y-1/2 right-20 top-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute flex items-center justify-center transform -translate-y-1/2 right-3 top-1/2"
              >
                <div className="flex items-center px-3 py-1 text-sm text-white rounded-lg shadow-sm bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691]">
                  <Zap className="w-4 h-4 mr-1" />
                  <span>AI Search</span>
                </div>
              </button>
            </form>
            
            {/* AI Suggestions Dropdown */}
            {isSearchFocused && (searchQuery || searchHistory.length > 0) && showSuggestions && (
              <div className="absolute left-0 right-0 z-50 mt-2 bg-white shadow-lg rounded-2xl top-full">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>AI Suggestions</span>
                  </div>
                </div>
                
                {/* Search history */}
                {!searchQuery && searchHistory.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                      <Clock className="w-3 h-3 mr-2" />
                      <span>Recent Searches</span>
                    </div>
                    {searchHistory.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSearchQuery(item);
                          setShowSuggestions(false);
                        }}
                      >
                        <Clock className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* AI-generated suggestions */}
                {searchQuery && suggestions.length > 0 && (
                  <div className="p-2">
                    <div className="flex items-center px-3 py-2 text-xs font-medium text-gray-500 uppercase">
                      <Brain className="w-3 h-3 mr-2" />
                      <span>Try these AI-powered searches</span>
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          // For demo purposes, just set the query to the suggestion text
                          // In a real app, you would execute the suggested search
                          setSearchQuery(suggestion.text);
                          setShowSuggestions(false);
                        }}
                      >
                        <Sparkles className="w-4 h-4 mr-3 text-yellow-500" />
                        <span className="text-gray-700">{suggestion.text}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="p-3 bg-gray-50 rounded-b-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Bot className="w-3 h-3 mr-1" />
                      <span>Powered by AI</span>
                    </div>
                    <button
                      onClick={toggleSearchType}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                    >
                      {searchType === 'keyword' ? 'Switch to AI Search' : 'Switch to Keyword Search'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 shadow-sm rounded-2xl md:hidden hover:bg-blue-700"
              onClick={() => setShowFilters(!showFilters)}
              style={{ fontFamily: "'SF Pro Text', sans-serif" }}
            >
              <Filter className="w-4 h-4 mr-2 text-white" />
              Filters
            </button>
            
            <div className="items-center hidden space-x-2 md:flex">
              <select 
                className="px-4 py-2 text-sm bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ fontFamily: "'SF Pro Text', sans-serif" }}
              >
                <option value="views">Most Views</option>
                <option value="likes">Most Likes</option>
                <option value="newest">Newest</option>
              </select>
              
              <select 
                className="px-4 py-2 text-sm bg-white shadow-sm rounded-2xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
                  className="text-sm text-blue-600 hover:text-blue-800"
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
                      className="w-4 h-4 mr-2 text-blue-600 accent-blue-600"
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
                        className="w-4 h-4 mr-2 text-blue-600 accent-blue-600"
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
                  className="w-full px-3 py-2 bg-white shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
                  className="w-full px-3 py-2 bg-white shadow-sm rounded-xl focus:ring-2 focus:ring-blue-300 focus:outline-none"
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

              <div className="mt-6">
                <h4 className="mb-3 font-medium text-gray-700" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Search Intelligence
                </h4>
                <div className="p-4 rounded-lg bg-blue-50">
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">AI-Powered Search</span>
                  </div>
                  <p className="text-xs text-blue-600">
                    Our AI understands context and meaning, not just keywords. Try asking naturally like you would ask a person.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Stats Bar */}
            <div className="hidden grid-cols-1 gap-5 mb-12 md:grid-cols-3">
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Total Views</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Play className="w-5 h-5 text-blue-600 fill-current" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.length}
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Trending Videos</p>
                  </div>
                </div>
              </div>
              
              <div className="p-5 transition-shadow duration-200 bg-white shadow-sm rounded-2xl hover:shadow-md">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                    <Heart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                      {videos.reduce((sum, video) => sum + video.like_count, 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>Total Likes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                {searchQuery ? (
                  <>
                    AI found {filteredVideos.length} results for "{searchQuery}"
                    {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                  </>
                ) : (
                  `Showing ${filteredVideos.length} of ${videos.length} trending videos`
                )}
              </p>
            </div>

            {/* AI Search Explanation */}
            {searchQuery && searchType === 'semantic' && (
              <div className="p-4 mb-6 bg-blue-50 rounded-2xl">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Bot className="w-5 h-5 mt-1 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">AI Search Understanding</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      Your search for "{searchQuery}" was processed using our AI semantic search, which understands the context and meaning behind your query rather than just matching keywords.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Loading indicator for search */}
            {searchLoading && (
              <div className="flex items-center justify-center py-8 mb-6 bg-white shadow-sm rounded-2xl">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">AI is searching...</h3>
                  <p className="text-gray-600">Analyzing videos based on your query</p>
                </div>
              </div>
            )}

            {/* Videos Grid */}
            {filteredVideos.length === 0 && !searchLoading ? (
              <div className="py-16 text-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full shadow-sm">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-gray-900" style={{ fontFamily: "'SF Pro Display', sans-serif" }}>
                  No videos found
                </h3>
                <p className="text-gray-600" style={{ fontFamily: "'SF Pro Text', sans-serif" }}>
                  Try adjusting your search or filters
                </p>
                <button 
                  className="px-4 py-2 mt-4 text-white bg-blue-600 shadow-sm rounded-xl hover:bg-blue-700"
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