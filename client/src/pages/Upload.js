import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload as UploadIcon, Film, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    setIsMounted(true);
  }, []);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setError('');
    } else {
      setError('Please select a valid video file');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setThumbnailFile(file);
      setError('');
    } else {
      setError('Please select a valid image file for thumbnail');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', videoFile);
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    }
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', JSON.stringify(tags.split(',').map((tag) => tag.trim())));

    try {
      const response = await axios.post('http://localhost:5000/api/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate(`/watch/${response.data.videoId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-screen bg-gray-50"
      >
        <div className="w-full max-w-md p-8 bg-white border rounded-lg shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to upload videos.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="max-w-6xl px-6 py-12 mx-auto mt-24">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={isMounted ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden bg-white border rounded-lg shadow-sm"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={isMounted ? { x: 0, opacity: 1 } : { x: -20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center p-12 bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691]"
            >
              <div className="text-center">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={isMounted ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-white/10"
                >
                  <UploadIcon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.h1 
                  initial={{ y: 10, opacity: 0 }}
                  animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="mb-3 text-2xl font-semibold text-white"
                >
                  Share Your Story
                </motion.h1>
                <motion.p 
                  initial={{ y: 10, opacity: 0 }}
                  animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="max-w-sm mx-auto leading-relaxed text-slate-300"
                >
                  Upload and share your videos with the world. Simple, fast, and secure.
                </motion.p>
                <motion.div 
                  initial={{ y: 10, opacity: 0 }}
                  animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-8 space-y-3 text-sm text-slate-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    <span>Multiple formats supported</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    <span>Auto thumbnail generation</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                    <span>Instant sharing</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={isMounted ? { x: 0, opacity: 1 } : { x: 20, opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-12"
            >
              <div className="max-w-md">
                <motion.h2 
                  initial={{ y: 10, opacity: 0 }}
                  animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mb-6 text-lg font-medium text-gray-900"
                >
                  Upload Details
                </motion.h2>

                {error && (
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="px-4 py-3 mb-6 text-sm text-red-700 border border-red-200 rounded-md bg-red-50"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Video Upload */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <label className="block mb-3 text-sm font-medium text-gray-700">Video File</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        required
                      />
                      <div className="flex items-center gap-3 p-4 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
                        <Film className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          {videoFile ? (
                            <p className="text-sm text-gray-700 truncate">{videoFile.name}</p>
                          ) : (
                            <p className="text-sm text-gray-500">Choose video file</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Thumbnail Upload */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label className="block mb-3 text-sm font-medium text-gray-700">Thumbnail (Optional)</label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-3 p-4 transition-colors border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400">
                        <Image className="w-5 h-5 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          {thumbnailFile ? (
                            <p className="text-sm text-gray-700 truncate">{thumbnailFile.name}</p>
                          ) : (
                            <p className="text-sm text-gray-500">Choose thumbnail image</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <label className="block mb-2 text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      required
                    />
                  </motion.div>

                  {/* Description */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    />
                  </motion.div>

                  {/* Category & Tags */}
                  <motion.div 
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="gaming">Gaming</option>
                        <option value="music">Music</option>
                        <option value="education">Education</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="sports">Sports</option>
                        <option value="technology">Technology</option>
                      </select>
                    </div>

                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-700">Tags</label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="gaming, tutorial"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      />
                    </div>
                  </motion.div>

                  <motion.button
                    initial={{ y: 10, opacity: 0 }}
                    animate={isMounted ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    type="submit"
                    disabled={uploading}
                    className="flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-all rounded-md 
                              bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] 
                              hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 rounded-full border-white/30 border-t-white animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadIcon className="w-4 h-4 mr-2" />
                        Upload Video
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Upload;