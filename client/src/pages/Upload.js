import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
    formData.append('tags', JSON.stringify(tags.split(',').map(tag => tag.trim())));

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
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-primary">Authentication Required</h2>
          <p className="text-gray-600">
            You need to be logged in to upload videos. Please log in or create an account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-primary">Upload Video</h1>
        
        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Video File *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
              required
            />
            {videoFile && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {videoFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Thumbnail Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
            />
            {thumbnailFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Selected: {thumbnailFile.name}</p>
                <img 
                  src={URL.createObjectURL(thumbnailFile)} 
                  alt="Thumbnail preview" 
                  className="mt-2 rounded-md max-h-48"
                />
              </div>
            )}
            <p className="mt-1 text-xs text-gray-500">
              If no thumbnail is provided, one will be generated from your video.
            </p>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
              required
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
            >
              <option value="">Select a category</option>
              <option value="gaming">Gaming</option>
              <option value="music">Music</option>
              <option value="education">Education</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., gaming, tutorial, tips"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading}
            className="w-full px-4 py-2 font-medium text-white transition-colors rounded-md bg-accent hover:bg-highlight disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;