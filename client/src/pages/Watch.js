import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { useAuth } from '../context/AuthContext';

const Watch = () => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  const { id } = useParams();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const [videoResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/videos/${id}`),
          axios.get(`http://localhost:5000/api/videos/${id}/comments`)
        ]);
        
        setVideo(videoResponse.data);
        setComments(commentsResponse.data);
        
        // Check if user liked the video
        if (currentUser) {
          try {
            const likeResponse = await axios.get(`http://localhost:5000/api/videos/${id}/like`);
            setLiked(likeResponse.data.liked);
          } catch (error) {
            // User hasn't liked the video
            setLiked(false);
          }
        }
        
        setLikeCount(videoResponse.data.like_count || 0);
      } catch (error) {
        setError('Failed to load video');
        console.error('Error fetching video:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id, currentUser]);

  const handleLike = async () => {
    if (!currentUser) {
      setError('Please log in to like videos');
      return;
    }

    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/videos/${id}/like`);
        setLikeCount(prev => prev - 1);
      } else {
        await axios.post(`http://localhost:5000/api/videos/${id}/like`);
        setLikeCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      setError('Failed to update like');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please log in to comment');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
        content: newComment
      });
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center text-red-500">
          {error || 'Video not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Video player and info */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-black rounded-lg video-player">
            <ReactPlayer
              url={`/videos/${video.filename}`}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>
          
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-primary">{video.title}</h1>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`p-2 rounded-full ${liked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                  <span className="font-medium">{likeCount}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 bg-gray-100 rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 9.5a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-2.25m-13 0h2.25M2 9.5a1.5 1.5 0 013 0m0 0h2.25M5 9.5a1.5 1.5 0 003 0m0 0h8.25M8 9.5a1.5 1.5 0 013 0m0 0h2.25M11 9.5a1.5 1.5 0 003 0m0 0h2.25M2 13.5a1.5 1.5 0 013 0m0 0h2.25M5 13.5a1.5 1.5 0 003 0m0 0h8.25M8 13.5a1.5 1.5 0 013 0m0 0h2.25M11 13.5a1.5 1.5 0 003 0m0 0h2.25" />
                    </svg>
                  </button>
                  <span className="font-medium">Share</span>
                </div>
              </div>
              
              <div className="text-gray-600">
                {video.views} views • {new Date(video.created_at).toLocaleDateString()}
              </div>
            </div>
            
            <div className="p-4 mt-6 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4 space-x-3">
                <img 
                  src={video.avatar || '/default-avatar.png'} 
                  alt={video.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{video.username}</h3>
                  <p className="text-sm text-gray-600">100 subscribers</p>
                </div>
                <button className="px-4 py-2 ml-auto text-sm font-medium text-white transition-colors rounded-full bg-accent hover:bg-highlight">
                  Subscribe
                </button>
              </div>
              
              <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>
          
          {/* Comments section */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-primary">
              Comments ({comments.length})
            </h2>
            
            {currentUser && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <img 
                    src={currentUser.avatar || '/default-avatar.png'} 
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-highlight"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white transition-colors rounded-full bg-accent hover:bg-highlight"
                  >
                    Comment
                  </button>
                </div>
              </form>
            )}
            
            <div className="space-y-4">
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <img 
                    src={comment.avatar || '/default-avatar.png'} 
                    alt={comment.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-grow">
                    <div className="p-3 rounded-lg bg-gray-50">
                      <h4 className="font-semibold">{comment.username}</h4>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              
              {comments.length === 0 && (
                <p className="py-4 text-center text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Suggested videos sidebar */}
        <div className="lg:col-span-1">
          <h2 className="mb-4 text-xl font-bold text-primary">Suggested Videos</h2>
          <div className="space-y-4">
            {/* Placeholder for suggested videos */}
            <div className="text-gray-500">Suggested videos will appear here</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;