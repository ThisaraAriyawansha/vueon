import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Heart, Share2, MessageCircle, Play, Eye, Calendar, User, Users, ChevronDown, ChevronUp } from 'lucide-react';


const Watch = () => {
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
  const [commentInputFocused, setCommentInputFocused] = useState(false);

  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const playerRef = useRef(null);
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  // Reset state when video ID changes
  useEffect(() => {
    setVideo(null);
    setComments([]);
    setError('');
    setVideoError(false);
    setVideoUrl('');
    setRetryCount(0);
    setLoading(true);
    setVideoReady(false);
  }, [id]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    // Also cleanup video player if needed
    if (playerRef.current) {
      try {
        // Try to stop the player gracefully
        const internalPlayer = playerRef.current.getInternalPlayer();
        if (internalPlayer && typeof internalPlayer.pause === 'function') {
          internalPlayer.pause();
        }
      } catch (e) {
        // Ignore cleanup errors
        console.log('Video player cleanup completed');
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Clean up previous request
    cleanup();
    abortControllerRef.current = new AbortController();

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setVideoError(false);
        setError('');

        console.log(`Fetching video data for ID: ${id}`);
        
        // Create axios config with timeout and signal
        const axiosConfig = {
          signal: abortControllerRef.current.signal,
          timeout: 15000, // Increased timeout
        };

        // Fetch video and comments with better error handling
        const videoResponse = await axios.get(
          `http://localhost:5000/api/videos/${id}`, 
          axiosConfig
        ).catch(err => {
          if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
            console.log('Video request cancelled');
            throw err;
          }
          console.error('Video fetch failed:', err.message);
          throw new Error(`Video fetch error: ${err.message}`);
        });

        if (!isMountedRef.current) return;

        const commentsResponse = await axios.get(
          `http://localhost:5000/api/videos/${id}/comments`, 
          axiosConfig
        ).catch(err => {
          if (err.name === 'AbortError' || err.code === 'ERR_CANCELED') {
            console.log('Comments request cancelled');
            throw err;
          }
          console.warn('Comments fetch failed, continuing without comments:', err.message);
          return { data: [] }; // Return empty comments if fetch fails
        });

        if (!isMountedRef.current) return;

        console.log('Video API response:', videoResponse.data);
        setVideo(videoResponse.data);
        setComments(commentsResponse.data);
        setLikeCount(videoResponse.data.like_count || 0);

        // Construct and validate video URL - FIXED PART
        const filename = videoResponse.data.filename;
        let url = '';
        
        if (filename) {
          // Remove 'videos/' prefix if it exists in filename
          const cleanFilename = filename.startsWith('videos/') ? filename : `videos/${filename}`;
          
          if (filename.includes('m3u8')) {
            url = `http://localhost:5000/${cleanFilename}`;
            console.log('HLS video URL constructed:', url);
          } else if (filename.match(/\.(mp4|webm|ogg)$/i)) {
            url = `http://localhost:5000/${cleanFilename}`;
            console.log('Direct video URL constructed:', url);
          } else {
            console.warn(`Invalid video file extension: ${filename}`);
            // Try to construct a URL anyway
            url = `http://localhost:5000/${cleanFilename}`;
          }
        } else {
          console.error('No filename provided in video data');
          setError('Video file not found');
          setVideoError(true);
          return;
        }
        
        setVideoUrl(url);
        console.log('Final video URL:', url);

        // Test video URL accessibility (optional, remove if causing issues)
        try {
          const headResponse = await axios.head(url, { 
            ...axiosConfig, 
            timeout: 5000 // Shorter timeout for HEAD request
          });
          console.log('Video URL is accessible:', { 
            status: headResponse.status, 
            contentType: headResponse.headers['content-type'] 
          });
        } catch (err) {
          if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
            console.warn('Video URL accessibility check failed:', {
              message: err.message,
              status: err.response?.status,
              url,
            });
            // Don't set error here, let the video player handle it
          }
        }

        // Fetch additional data in parallel (non-blocking)
        const additionalDataPromises = [];

        // Fetch user-specific data if logged in
        if (currentUser) {
          const likePromise = axios.get(`http://localhost:5000/api/videos/${id}/like`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            signal: abortControllerRef.current.signal,
            timeout: 5000,
          }).then(response => {
            if (isMountedRef.current) {
              setLiked(response.data.liked);
              console.log('Like status fetched:', response.data.liked);
            }
          }).catch(error => {
            if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
              console.warn('Failed to fetch like status:', error.message);
            }
          });
          
          additionalDataPromises.push(likePromise);
        }

        // Fetch suggested videos
        const suggestedPromise = axios.get('http://localhost:5000/api/videos/trending', {
          signal: abortControllerRef.current.signal,
          timeout: 8000,
        }).then(response => {
          if (isMountedRef.current) {
            setSuggestedVideos(response.data.filter(v => v.id !== parseInt(id)));
            console.log('Suggested videos fetched:', response.data.length);
          }
        }).catch(error => {
          if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
            console.error('Error fetching suggested videos:', error.message);
          }
        });
        
        additionalDataPromises.push(suggestedPromise);

        // Fetch subscription data
        if (videoResponse.data.user_id) {
          if (currentUser) {
            const subscribePromise = axios.get(`http://localhost:5000/api/users/subscribe/${videoResponse.data.user_id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              signal: abortControllerRef.current.signal,
              timeout: 5000,
            }).then(response => {
              if (isMountedRef.current) {
                setSubscribed(response.data.subscribed);
                console.log('Subscription status fetched:', response.data.subscribed);
              }
            }).catch(error => {
              if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
                console.error('Error fetching subscription status:', error.message);
              }
            });
            
            additionalDataPromises.push(subscribePromise);
          }

          const subscriberPromise = axios.get(
            `http://localhost:5000/api/users/channel/${videoResponse.data.user_id}/subscribers`,
            { 
              signal: abortControllerRef.current.signal,
              timeout: 5000,
            }
          ).then(response => {
            if (isMountedRef.current) {
              setSubscriberCount(response.data.count);
              console.log('Subscriber count fetched:', response.data.count);
            }
          }).catch(error => {
            if (error.name !== 'AbortError' && error.code !== 'ERR_CANCELED') {
              console.error('Error fetching subscriber count:', error.message);
            }
          });
          
          additionalDataPromises.push(subscriberPromise);
        }

        // Wait for all additional data (but don't block the main UI)
        Promise.allSettled(additionalDataPromises).then(() => {
          console.log('All additional data requests completed');
        });

      } catch (error) {
        if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
          console.log('Fetch aborted - likely due to navigation or component unmount');
          return;
        }
        
        if (isMountedRef.current) {
          let errorMsg = 'Failed to load video';
          
          if (error.response?.status === 404) {
            errorMsg = 'Video not found';
          } else if (error.response?.status === 500) {
            errorMsg = 'Server error - please try again later';
          } else if (error.message) {
            errorMsg = `Failed to load video: ${error.message}`;
          }
          
          setError(errorMsg);
          console.error('Video fetch error:', {
            message: error.message,
            status: error.response?.status,
            url: `http://localhost:5000/api/videos/${id}`,
          });
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    // Add a small delay to prevent rapid-fire requests
    const timeoutId = setTimeout(fetchVideoData, 100);

    return () => {
      clearTimeout(timeoutId);
      cleanup();
    };
  }, [id, currentUser, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      cleanup();
    };
  }, [cleanup]);

  // Handle video player errors with better retry logic
  const handleVideoError = useCallback((error, data, hlsInstance) => {
    if (!isMountedRef.current) return;

    const errorDetails = {
      error: error?.message || error,
      data,
      hlsInstance: hlsInstance ? 'HLS instance present' : 'No HLS instance',
      videoUrl,
      retryCount,
      response: data?.response || null,
    };
    console.error('Video player error:', errorDetails);

    if (data && data.type && data.details) {
      console.error(`HLS Error: ${data.type} - ${data.details}`);
    }

    // Don't retry more than 2 times
    if (retryCount >= 2) {
      setVideoError(true);
      setError('Video playback failed. Please try refreshing the page.');
      console.log('Max retries reached, stopping attempts');
      return;
    }

    // Try different fallback strategies
    if (video && video.filename) {
      if (video.filename.includes('.m3u8') && retryCount === 0) {
        // Try MP4 version first
        const mp4Url = `http://localhost:5000/videos/${video.filename.replace(/\.m3u8$/, '.mp4')}`;
        console.log('Trying MP4 fallback URL:', mp4Url);
        setVideoUrl(mp4Url);
        setRetryCount(prev => prev + 1);
      } else {
        // General retry with delay
        console.log('Retrying with delay...');
        setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
            setVideoError(false);
          }
        }, 2000);
      }
    } else {
      setVideoError(true);
      setError('No valid video file provided');
      console.warn('No filename available for fallback');
    }
  }, [video, videoUrl, retryCount]);


  const handleSuggestedVideoClick = useCallback((videoId) => {
    console.log(`Navigating to suggested video ID: ${videoId}`);
    navigate(`/watch/${videoId}`);
  }, [navigate]);

  const handleLike = async () => {
    if (!currentUser) {
      setError('Please log in to like videos');
      return;
    }
    
    try {
      const config = { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 5000,
      };
      
      if (liked) {
        await axios.delete(`http://localhost:5000/api/videos/${id}/like`, config);
        setLikeCount(prev => Math.max(0, prev - 1));
        console.log('Video unliked');
      } else {
        await axios.post(`http://localhost:5000/api/videos/${id}/like`, {}, config);
        setLikeCount(prev => prev + 1);
        console.log('Video liked');
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Like error:', error.message);
      setError('Failed to update like. Please try again.');
      setTimeout(() => setError(''), 3000); // Auto-clear error
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      setError('Please log in to subscribe to channels');
      return;
    }
    
    if (!video?.user_id) {
      setError('Unable to subscribe - channel information not available');
      return;
    }
    
    try {
      const config = { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 5000,
      };
      
      if (subscribed) {
        await axios.delete(`http://localhost:5000/api/users/subscribe/${video.user_id}`, config);
        setSubscribed(false);
        setSubscriberCount(prev => Math.max(0, prev - 1));
        console.log('Unsubscribed from channel');
      } else {
        await axios.post(`http://localhost:5000/api/users/subscribe/${video.user_id}`, {}, config);
        setSubscribed(true);
        setSubscriberCount(prev => prev + 1);
        console.log('Subscribed to channel');
      }
    } catch (error) {
      console.error('Subscribe error:', error.message);
      setError('Failed to update subscription. Please try again.');
      setTimeout(() => setError(''), 3000); // Auto-clear error
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Please log in to comment');
      return;
    }
    
    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      return;
    }
    
    try {
      const config = { 
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        timeout: 8000,
      };
      
      const response = await axios.post(
        `http://localhost:5000/api/videos/${id}/comments`,
        { content: trimmedComment },
        config
      );
      
      setComments(prev => [response.data, ...prev]);
      setNewComment('');
      console.log('Comment posted:', response.data);
    } catch (error) {
      console.error('Comment error:', error.message);
      setError('Failed to post comment. Please try again.');
      setTimeout(() => setError(''), 3000); // Auto-clear error
    }
  };

  const handleRetry = useCallback(() => {
    setVideoError(false);
    setRetryCount(0);
    setError('');
    setVideoReady(false);
    
    // Force re-render of video player
    const currentUrl = videoUrl;
    setVideoUrl('');
    console.log('Retrying video playback with URL:', currentUrl);
    
    setTimeout(() => {
      if (isMountedRef.current) {
        setVideoUrl(currentUrl);
      }
    }, 500);
  }, [videoUrl]);

  // Helper functions
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const formatSubscribers = (count) => {
    if (!count) return '0 subscribers';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M subscribers`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K subscribers`;
    return `${count} subscribers`;
  };

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto mt-24">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error && !video) {
    return (
      <div className="container px-4 py-8 mx-auto mt-24">
        <div className="max-w-md mx-auto text-center">
          <div className="p-6 text-red-700 bg-red-100 rounded-lg">
            <h2 className="mb-2 text-lg font-semibold">Unable to Load Video</h2>
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 text-white rounded bg-accent hover:bg-highlight"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      
      {error && (
        <div className="fixed z-50 transform -translate-x-1/2 top-6 left-1/2 animate-slide-down">
          <div className="flex items-center px-6 py-4 space-x-3 text-red-800 border border-red-200 shadow-lg bg-red-50 rounded-2xl backdrop-blur-sm bg-opacity-95">
            <svg className="flex-shrink-0 w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
            <button 
              className="ml-4 text-red-400 transition-colors hover:text-red-600" 
              onClick={() => setError('')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <div className="container px-6 py-8 mx-auto pt-28">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
          {/* Main Video Section */}
          <div className="space-y-6 xl:col-span-3">
            {/* Video Player */}
            <div className="relative group">
              <div className="overflow-hidden shadow-2xl bg-slate-900 rounded-3xl aspect-video">
                {!videoError && videoUrl ? (
                  <video 
                    controls 
                    width="100%" 
                    height="100%"
                    className="object-cover w-full h-full"
                    onError={(e) => console.error('Video element error:', e)}
                    onLoadStart={() => console.log('Load start')}
                    onLoadedData={() => console.log('Loaded data')}
                    onCanPlay={() => console.log('Can play')}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-white">
                    <div className="space-y-4 text-center">
                      <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-slate-800">
                        <Play className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="mb-2 text-lg font-semibold">Video playback failed</p>
                        <p className="mb-4 text-sm text-slate-400">
                          {retryCount > 0 ? `Retry attempt ${retryCount}/2 failed` : 'The video could not be loaded'}
                        </p>
                        <button
                          onClick={handleRetry}
                          disabled={retryCount >= 2}
                          className="px-6 py-3 font-medium text-white transition-all duration-300 transform bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed hover:scale-105"
                        >
                          {retryCount >= 2 ? 'Max retries reached' : 'Retry'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Video Info */}
            <div className="space-y-4">
              <div>
                <h1 className="mb-3 text-xl font-bold leading-tight xl:text-2xl text-slate-900">
                  {video?.title}
                </h1>
                
                {/* Stats and Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">{formatViews(video?.views)}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-sm">{video ? new Date(video.created_at).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleLike}
                      disabled={!currentUser}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
                        liked 
                          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                          : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      } ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 shadow-md'}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{likeCount}</span>
                    </button>
                    
                    <button className="flex items-center px-3 py-1.5 space-x-1.5 transition-all duration-300 border rounded-full shadow-md bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:scale-105">
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Channel Info */}
              <div className="p-4 bg-white border shadow-md rounded-xl border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={video?.avatar ? `http://localhost:5000/${video.avatar}` : '/default-avatar.png'}
                        alt={video?.username || 'Channel'}
                        className="object-cover w-12 h-12 rounded-full ring-2 ring-slate-200"
                        onError={(e) => {
                          e.target.src = '/default-avatar.png';
                        }}
                      />
                      <div className="absolute w-4 h-4 bg-green-400 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{video?.username}</h3>
                      <div className="flex items-center space-x-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-xs">{formatSubscribers(subscriberCount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {currentUser && video?.user_id !== currentUser.id && (
                    <button
                      onClick={handleSubscribe}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-md ${
                        subscribed 
                          ? 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                      }`}
                    >
                      {subscribed ? 'Subscribed' : 'Subscribe'}
                    </button>
                  )}
                </div>
                
                {/* Description */}
                <div className="relative">
                  <div className={`text-sm text-slate-700 leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'} whitespace-pre-wrap`}>
                    {video?.description}
                  </div>
                  {video?.description && video.description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="flex items-center mt-1.5 space-x-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      <span>{showFullDescription ? 'Show less' : 'Show more'}</span>
                      {showFullDescription ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Comments Section */}
            <div className="p-6 bg-white border shadow-lg rounded-2xl border-slate-200">
              <div className="flex items-center mb-6 space-x-3">
                <MessageCircle className="w-6 h-6 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  Comments ({comments.length})
                </h2>
              </div>
              
              {currentUser && (
                              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex space-x-3">
                  <img
                    src={currentUser.avatar ? `http://localhost:5000/${currentUser.avatar}` : '/default-avatar.png'}
                    alt={currentUser.username}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                  <div className="flex-grow">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-highlight"
                      maxLength={500}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-2 text-white transition-colors rounded-full bg-accent hover:bg-highlight disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Comment
                  </button>
                </div>
              </form>
              )}
              
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={comment.id} className={`flex space-x-3 animate-slide-in`} style={{animationDelay: `${index * 0.1}s`}}>
                    <img
                      src={comment.avatar ? `http://localhost:5000/${comment.avatar}` : '/default-avatar.png'}
                      alt={comment.username}
                      className="flex-shrink-0 object-cover w-8 h-8 rounded-full ring-2 ring-slate-200"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="p-3 transition-colors duration-300 bg-slate-50 rounded-xl hover:bg-slate-100">
                        <div className="flex items-center mb-1 space-x-2">
                          <h4 className="text-sm font-semibold text-slate-900">{comment.username}</h4>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <div className="py-8 text-center">
                    <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100">
                      <MessageCircle className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-base text-slate-500">No comments yet</p>
                    <p className="mt-1 text-xs text-slate-400">Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Suggested Videos Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky space-y-6 top-28">
              <div className="p-6 bg-white border shadow-lg rounded-2xl border-slate-200">
                <h2 className="flex items-center mb-6 space-x-2 text-xl font-bold text-slate-900">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"></div>
                  <span>Up Next</span>
                </h2>
                
                <div className="space-y-4">
                  {suggestedVideos.map((suggestedVideo, index) => (
                    <div
                      key={suggestedVideo.id}
                      className={`group cursor-pointer animate-slide-in`}
                      style={{animationDelay: `${index * 0.1}s`}}
                      onClick={() => handleSuggestedVideoClick(suggestedVideo.id)}
                    >
                      <div className="flex space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="relative flex-shrink-0 w-40 h-24 overflow-hidden bg-slate-200 rounded-xl">
                          <img
                            src={suggestedVideo.thumbnail ? `http://localhost:5000/${suggestedVideo.thumbnail}` : '/default-thumbnail.jpg'}
                            alt={suggestedVideo.title}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = '/default-thumbnail.jpg';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black bg-opacity-0 group-hover:bg-opacity-20">
                            <Play className="w-6 h-6 text-white transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                          </div>
                          <div className="absolute px-2 py-1 text-xs font-medium text-white bg-black rounded-lg bottom-2 right-2 bg-opacity-80">
                            {formatDuration(suggestedVideo.duration)}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm font-semibold leading-tight transition-colors text-slate-900 line-clamp-2 group-hover:text-blue-600">
                            {suggestedVideo.title}
                          </h4>
                          <div className="flex items-center space-x-1 text-xs text-slate-500">
                            <User className="w-3 h-3" />
                            <span className="truncate">{suggestedVideo.username}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{formatViews(suggestedVideo.views)}</span>
                            </div>
                            <span>•</span>
                            <span>{new Date(suggestedVideo.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {suggestedVideos.length === 0 && (
                    <div className="py-8 text-center">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100">
                        <Play className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No suggested videos available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </div>
  );
  };

export default Watch; 