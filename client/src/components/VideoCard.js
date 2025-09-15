import React from 'react';
import { Link } from 'react-router-dom';

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

  return (
    <div className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
      <Link to={`/watch/${video.id}`}>
        <div className="relative">
          <img 
            src={getThumbnailSrc()}
            alt={video.title}
            className="object-cover w-full h-48"
            onError={handleThumbnailError}
          />
          {video.duration > 0 && (
            <div className="absolute px-2 py-1 text-xs text-white bg-black bg-opacity-75 rounded bottom-2 right-2">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/watch/${video.id}`}>
          <h3 className="mb-2 text-lg font-semibold line-clamp-2 hover:text-highlight">
            {video.title || 'Untitled Video'}
          </h3>
        </Link>
        
        <Link to={`/profile/${video.user_id}`}>
          <div className="flex items-center mt-2 text-gray-600 hover:text-highlight">
            <img 
              src={getAvatarSrc()}
              alt={video.username || 'User'}
              className="w-8 h-8 mr-2 rounded-full"
              onError={handleAvatarError}
            />
            <span className="text-sm">{video.username || 'Unknown User'}</span>
          </div>
        </Link>
        
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span>{formatViews(video.views)}</span>
          <span>{video.like_count} likes</span> {/* Add this line */}
          <span>{video.created_at ? new Date(video.created_at).toLocaleDateString() : 'Unknown date'}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;