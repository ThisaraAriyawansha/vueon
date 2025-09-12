import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + 'M';
    } else if (views >= 1000) {
      return (views / 1000).toFixed(1) + 'K';
    }
    return views;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/watch/${video.id}`}>
        <div className="relative">
          <img 
            src={`/videos/${video.thumbnail}`} 
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          {video.duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/watch/${video.id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-highlight">
            {video.title}
          </h3>
        </Link>
        
        <Link to={`/profile/${video.user_id}`}>
          <div className="flex items-center mt-2 text-gray-600 hover:text-highlight">
            <img 
              src={video.avatar || '/default-avatar.png'} 
              alt={video.username}
              className="w-8 h-8 rounded-full mr-2"
            />
            <span className="text-sm">{video.username}</span>
          </div>
        </Link>
        
        <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
          <span>{formatViews(video.views)} views</span>
          <span>{new Date(video.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;