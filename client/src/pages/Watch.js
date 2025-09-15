import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [retryCount, setRetryCount] = useState(0);

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

        // Construct and validate video URL
        const filename = videoResponse.data.filename;
        let url = '';
        
        if (filename) {
          if (filename.includes('m3u8')) {
            url = `http://localhost:5000/videos/${filename}`;
            console.log('HLS video URL constructed:', url);
          } else if (filename.match(/\.(mp4|webm|ogg)$/i)) {
            url = `http://localhost:5000/videos/${filename}`;
            console.log('Direct video URL constructed:', url);
          } else {
            console.warn(`Invalid video file extension: ${filename}`);
            // Try to construct a URL anyway
            url = `http://localhost:5000/videos/${filename}`;
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

  const handleVideoReady = useCallback(() => {
    if (isMountedRef.current) {
      setVideoError(false);
      setRetryCount(0);
      setError(''); // Clear any previous errors
      console.log('Video player ready');
    }
  }, []);

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
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error && !video) {
    return (
      <div className="container px-4 py-8 mx-auto">
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
    <div className="container px-4 py-8 mx-auto">
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
          {error}
          <button 
            className="float-right px-2 py-1 font-bold rounded hover:bg-red-200" 
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden bg-black rounded-lg aspect-video">
            {!videoError && videoUrl ? (
              <ReactPlayer
                ref={playerRef}
                url={videoUrl}
                width="100%"
                height="100%"
                controls
                playing={false}
                onError={handleVideoError}
                onStart={() => console.log('Video started playing')}
                onPlay={() => console.log('Video playing')}
                onReady={handleVideoReady}
                config={{
                  file: {
                    attributes: {
                      crossOrigin: 'anonymous',
                      preload: 'metadata',
                    },
                    forceHLS: videoUrl.includes('.m3u8'),
                    hlsOptions: {
                      enableWorker: false,
                      lowLatencyMode: false, // Disabled for better compatibility
                      backBufferLength: 90,
                      maxBufferLength: 30,
                    },
                  },
                }}
                fallback={
                  <div className="flex items-center justify-center w-full h-full text-white bg-gray-800">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-4 border-b-2 border-white rounded-full animate-spin"></div>
                      <p>Loading video...</p>
                    </div>
                  </div>
                }
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white bg-gray-800">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="mb-2 text-lg">Video playback failed</p>
                  <p className="mb-4 text-sm text-gray-400">
                    {retryCount > 0 ? `Retry attempt ${retryCount}/2 failed` : 'The video could not be loaded'}
                  </p>
                  <button
                    onClick={handleRetry}
                    disabled={retryCount >= 2}
                    className="px-4 py-2 text-white rounded bg-accent hover:bg-highlight disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {retryCount >= 2 ? 'Max retries reached' : 'Retry'}
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Video info section */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-primary">{video?.title}</h1>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    disabled={!currentUser}
                    className={`p-2 rounded-full transition-colors ${
                      liked ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-600'
                    } ${!currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  </button>
                  <span className="font-medium">{likeCount}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 transition-colors bg-gray-100 rounded-full hover:bg-gray-200">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                  </button>
                  <span className="font-medium">Share</span>
                </div>
              </div>
              <div className="text-gray-600">
                {formatViews(video?.views)} • {video ? new Date(video.created_at).toLocaleDateString() : ''}
              </div>
            </div>
            
            {/* Channel info */}
            <div className="p-4 mt-6 rounded-lg bg-gray-50">
              <div className="flex items-center mb-4 space-x-3">
                <img
                  src={video?.avatar ? `http://localhost:5000/${video.avatar}` : '/default-avatar.png'}
                  alt={video?.username || 'Channel'}
                  className="w-10 h-10 rounded-full"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <div className="flex-grow">
                  <h3 className="font-semibold">{video?.username}</h3>
                  <p className="text-sm text-gray-600">{formatSubscribers(subscriberCount)}</p>
                </div>
                {currentUser && video?.user_id !== currentUser.id && (
                  <button
                    onClick={handleSubscribe}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      subscribed 
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                        : 'bg-accent text-white hover:bg-highlight'
                    }`}
                  >
                    {subscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{video?.description}</p>
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
              {comments.map(comment => (
                <div key={comment.id} className="flex space-x-3">
                  <img
                    src={comment.avatar ? `http://localhost:5000/${comment.avatar}` : '/default-avatar.png'}
                    alt={comment.username}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
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
          <div className="space-y-3">
            {suggestedVideos.map(suggestedVideo => (
              <div
                key={suggestedVideo.id}
                className="flex space-x-2 cursor-pointer transition-transform hover:scale-[1.02]"
                onClick={() => handleSuggestedVideoClick(suggestedVideo.id)}
              >
                <div className="relative flex-shrink-0 w-40 h-24 overflow-hidden bg-gray-300 rounded-lg">
                  <img
                    src={suggestedVideo.thumbnail ? `http://localhost:5000/videos/${suggestedVideo.thumbnail}` : '/default-thumbnail.jpg'}
                    alt={suggestedVideo.title}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = '/default-thumbnail.jpg';
                    }}
                  />
                  <div className="absolute px-1 text-xs text-white bg-black rounded bottom-1 right-1">
                    {formatDuration(suggestedVideo.duration)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="mb-1 text-sm font-semibold leading-tight line-clamp-2">
                    {suggestedVideo.title}
                  </h4>
                  <p className="text-xs text-gray-600 truncate">{suggestedVideo.username}</p>
                  <p className="text-xs text-gray-500">
                    {formatViews(suggestedVideo.views)} • {new Date(suggestedVideo.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {suggestedVideos.length === 0 && (
              <div className="py-4 text-center text-gray-500">
                No suggested videos available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;