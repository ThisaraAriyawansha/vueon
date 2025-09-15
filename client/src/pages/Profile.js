import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  const [isEditing, setIsEditing] = useState(false);
  
  const { id } = useParams();
  const { currentUser } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: null
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, videosResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`),
          axios.get(`http://localhost:5000/api/users/${id}/videos`)
        ]);
        
        setUser(userResponse.data);
        setVideos(videosResponse.data);
        setFormData(prev => ({
          ...prev,
          username: userResponse.data.username,
          email: userResponse.data.email
        }));
      } catch (error) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      avatar: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('username', formData.username);
      updateData.append('email', formData.email);
      
      if (formData.currentPassword) {
        updateData.append('currentPassword', formData.currentPassword);
      }
      if (formData.newPassword) {
        updateData.append('newPassword', formData.newPassword);
      }
      if (formData.avatar) {
        updateData.append('avatar', formData.avatar);
      }

      const response = await axios.put(`http://localhost:5000/api/users/${id}`, updateData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data.user);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center text-red-500">
          {error || 'User not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={`http://localhost:5000/${user.avatar}`} 
              alt={user.username}
              className="w-24 h-24 rounded-full"
            />
            {isOwnProfile && isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-md cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </label>
            )}
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                  placeholder="Username"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                  placeholder="Email"
                />
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-primary">{user.username}</h1>
                <p className="mt-2 text-gray-600">{user.email}</p>
              </div>
            )}
            <div className="flex mt-4 space-x-6 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-primary">{videos.length}</span> videos
              </div>
              <div>
                <span className="font-semibold text-primary">0</span> subscribers
              </div>
            </div>
          </div>
          {isOwnProfile && (
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError('');
                      setSuccess('');
                      setFormData(prev => ({
                        ...prev,
                        username: user.username,
                        email: user.email,
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      }));
                    }}
                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-white rounded-md bg-accent hover:bg-highlight"
                >
                  Edit Profile
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 mt-4 text-red-700 bg-red-100 border border-red-400 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 mt-4 text-green-700 bg-green-100 border border-green-400 rounded-md">
            {success}
          </div>
        )}

        {isEditing && (
          <div className="p-4 mt-6 rounded-md bg-gray-50">
            <h3 className="mb-3 font-semibold text-primary">Change Password</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                placeholder="Current Password"
              />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                placeholder="Confirm New Password"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Leave password fields empty if you don't want to change your password.
            </p>
          </div>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos'
                ? 'border-highlight text-highlight'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'liked'
                ? 'border-highlight text-highlight'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Liked Videos
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-highlight text-highlight'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Settings
            </button>
          )}
        </nav>
      </div>

      {activeTab === 'videos' && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-primary">Uploaded Videos</h2>
          {videos.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p className="text-lg">No videos uploaded yet</p>
              <p className="mt-2">This user hasn't uploaded any videos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {videos.map(video => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'liked' && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-primary">Liked Videos</h2>
          <div className="py-12 text-center text-gray-500">
            <p className="text-lg">Liked videos will appear here</p>
          </div>
        </div>
      )}

      {activeTab === 'settings' && isOwnProfile && (
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-primary">Account Settings</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Avatar
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
              />
            </div>

            <div className="p-4 rounded-md bg-gray-50">
              <h3 className="mb-3 font-semibold text-primary">Change Password</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 text-white rounded-md bg-accent hover:bg-highlight"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    username: user.username,
                    email: user.email,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  }));
                  setError('');
                  setSuccess('');
                }}
                className="px-6 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;