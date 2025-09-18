import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Eye, Heart, Clock } from 'lucide-react';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M views';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K views';
    }
    return views + ' views';
  };


  // Handle thumbnail path
  const getThumbnailSrc = () => {
    if (!video.thumbnail) return 'http://localhost:5000/default-thumbnail.jpg';
    
    // If thumbnail is a placeholder
    if (video.thumbnail === 'placeholder') {
      return 'http://localhost:5000/default-thumbnail.jpg';
    }
    
    // Check if thumbnail is in a subdirectory (processed video)
    if (video.thumbnail.includes('/')) {
      return `http://localhost:5000/${video.thumbnail}`;
    }
    
    // Default case - assume it's in the thumbnails directory
    return `http://localhost:5000/${video.thumbnail}`;
  };

  // Handle avatar path - FIXED: Check if avatar exists and handle properly
  const getAvatarSrc = () => {
    // If avatar is not provided or is empty
    if (!video.avatar || video.avatar === 'null' || video.avatar === 'undefined') {
      return 'http://localhost:5000/default-avatar.png';
    }
    
    // If avatar is a full URL (from social logins, etc.)
    if (video.avatar.startsWith('http')) {
      return video.avatar;
    }
    
    // If avatar is a local file path
    return `http://localhost:5000/${video.avatar}`;
  };

  // Fallback for thumbnail errors
  const handleThumbnailError = (e) => {
    e.target.src = 'http://localhost:5000/default-thumbnail.jpg';
  };

  // Fallback for avatar errors
  const handleAvatarError = (e) => {
    e.target.src = 'http://localhost:5000/default-avatar.png';
  };

   const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };


    const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatLikes = (likes) => {
    if (!likes) return '0';
    if (likes >= 1000000) {
      return (likes / 1000000).toFixed(1) + 'M';
    } else if (likes >= 1000) {
      return (likes / 1000).toFixed(1) + 'K';
    }
    return likes.toString();
  };

  
  return (
     <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#add8e6]/30">
      {/* Thumbnail Section */}
      <Link to={`/watch/${video.id}`} className="relative block">
        <div className="relative overflow-hidden aspect-video rounded-t-2xl bg-gradient-to-br from-gray-100 to-gray-200">
          <img 
            src={getThumbnailSrc()}
            alt={video.title}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
            onError={handleThumbnailError}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black/0 group-hover:bg-black/20">
            <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 transform scale-75 rounded-full shadow-lg opacity-0 bg-white/90 backdrop-blur-sm group-hover:opacity-100 group-hover:scale-100">
              <Play className="w-5 h-5 text-[#192f4a] ml-0.5" fill="currentColor" />
            </div>
          </div>
          
          {/* Duration Badge */}
          {video.duration > 0 && (
            <div className="absolute bottom-3 right-3 bg-[#192f4a]/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(video.duration)}</span>
            </div>
          )}
          
          {/* Live Badge (if applicable) */}
          {video.isLive && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>
      </Link>
      
      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <Link to={`/watch/${video.id}`} className="block">
          <h3 className="text-[#192f4a] font-semibold text-base leading-snug line-clamp-2 group-hover:text-[#003366] transition-colors duration-200">
            {video.title || 'Untitled Video'}
          </h3>
        </Link>
        
        {/* Creator Info */}
        <Link to={`/profile/${video.user_id}`} className="flex items-center space-x-3 group/creator">
          <div className="relative">
            <img 
              src={getAvatarSrc()}
              alt={video.username || 'User'}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 group-hover/creator:border-[#add8e6] transition-colors duration-200"
              onError={handleAvatarError}
            />
            {video.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#005691] rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[#005691] font-medium text-sm group-hover/creator:text-[#003366] transition-colors duration-200 truncate">
              {video.username || 'Unknown User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {video.subscriberCount ? `${formatLikes(video.subscriberCount)} subscribers` : 'Creator'}
            </p>
          </div>
        </Link>
        
        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5 text-[#005691]">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-medium">{formatViews(video.views)}</span>
            </div>
            
            <div className="flex items-center space-x-1.5 text-[#005691]">
              <Heart className="w-3.5 h-3.5" />
              <span className="font-medium">{formatLikes(video.like_count)}</span>
            </div>
          </div>
          
          <div className="text-xs font-medium text-gray-400">
            {formatDate(video.created_at)}
          </div>
        </div>
        
        {/* Tags (if available) */}

        
        {/* Quality Badge */}
        {video.quality && (
          <div className="flex justify-end">
            <span className="px-2 py-0.5 bg-gradient-to-r from-[#005691] to-[#0077b6] text-white rounded-md text-xs font-bold">
              {video.quality}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCard;