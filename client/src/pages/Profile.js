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
  const [likedVideos, setLikedVideos] = useState([]);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [adminVideos, setAdminVideos] = useState([]);
  const [adminPagination, setAdminPagination] = useState({});
  const [adminFilters, setAdminFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });

  const { id } = useParams();
  const { currentUser } = useAuth();

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
        const [userResponse, videosResponse, subscribersResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`),
          axios.get(`http://localhost:5000/api/users/${id}/videos`),
          axios.get(`http://localhost:5000/api/users/${id}/subscribers/count`)
        ]);
        
        setUser(userResponse.data);
        setVideos(videosResponse.data);
        setSubscriberCount(subscribersResponse.data.count);
        
        if (currentUser && currentUser.id === parseInt(id)) {
          const likedResponse = await axios.get(`http://localhost:5000/api/users/${id}/liked-videos`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setLikedVideos(likedResponse.data);
        }
        
        setFormData(prev => ({
          ...prev,
          username: userResponse.data.username,
          email: userResponse.data.email
        }));
      } catch (error) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, currentUser]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (currentUser && user && currentUser.id !== user.id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/subscribe/${user.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setIsSubscribed(response.data.subscribed);
        } catch (error) {}
      }
    };
    
    if (user) checkSubscription();
  }, [currentUser, user]);

  useEffect(() => {
    if (activeTab === 'admin' && currentUser?.role === 'admin') {
      fetchAdminVideos();
    }
  }, [activeTab, adminFilters, currentUser]);

  const fetchAdminVideos = async () => {
    try {
      const params = new URLSearchParams();
      if (adminFilters.status) params.append('status', adminFilters.status);
      params.append('page', adminFilters.page);
      params.append('limit', adminFilters.limit);

      const response = await axios.get(`http://localhost:5000/api/videos/admin/all?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setAdminVideos(response.data.videos);
      setAdminPagination(response.data.pagination);
    } catch (error) {
      setError('Failed to fetch admin videos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('username', formData.username);
      updateData.append('email', formData.email);
      if (formData.currentPassword) updateData.append('currentPassword', formData.currentPassword);
      if (formData.newPassword) updateData.append('newPassword', formData.newPassword);
      if (formData.avatar) updateData.append('avatar', formData.avatar);

      const response = await axios.put(`http://localhost:5000/api/users/${id}`, updateData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(response.data.user);
      setSuccess('Profile updated');
      setIsEditing(false);
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      setError(error.response?.data?.message || 'Update failed');
    }
  };

  const handleSubscribe = async () => {
    try {
      await axios.post(`http://localhost:5000/api/users/subscribe/${user.id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsSubscribed(true);
      setSubscriberCount(prev => prev + 1);
    } catch (error) {}
  };

  const handleUnsubscribe = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/subscribe/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setIsSubscribed(false);
      setSubscriberCount(prev => prev - 1);
    } catch (error) {}
  };

  const handleEditVideo = async (videoId, formData) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/videos/${videoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (activeTab === 'videos') {
        setVideos(prev => prev.map(video => video.id === videoId ? response.data : video));
      } else if (activeTab === 'admin') {
        setAdminVideos(prev => prev.map(video => video.id === videoId ? response.data : video));
      }

      setEditingVideo(null);
      setSuccess('Video updated');
    } catch (error) {
      setError(error.response?.data?.message || 'Video update failed');
    }
  };

  const handleStatusChange = async (videoId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/videos/${videoId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Status updated');
      fetchAdminVideos();
    } catch (error) {
      setError(error.response?.data?.message || 'Status update failed');
    }
  };

  const isOwnProfile = currentUser && currentUser.id === parseInt(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-8 h-8 rounded-full border- battlefield4 border-t-gray-900 animate-spin" />
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 bg-white shadow-sm rounded-xl">
          <h2 className="text-base font-semibold text-gray-900">Profile Not Found</h2>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl px-4 py-6 mx-auto">
        {/* Profile Header */}
        <div className="p-6 mb-6 bg-white shadow-sm rounded-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={`http://localhost:5000/${user.avatar}`} 
                alt={user.username}
                className="object-cover w-16 h-16 rounded-full ring-1 ring-gray-200"
              />
              {isOwnProfile && isEditing && (
                <label className="absolute bottom-0 right-0 flex items-center justify-center w-6 h-6 text-white transition bg-gray-900 rounded-full cursor-pointer hover:bg-gray-700">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Username"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{user.username}</h1>
                  <p className="mt-1 text-sm text-gray-500">{user.email}</p>
                </div>
              )}
              <div className="flex gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">{videos.length}</span>
                  <span className="text-gray-500">videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-900">{subscriberCount}</span>
                  <span className="text-gray-500">subscribers</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                isEditing ? (
                  <>
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-2 text-sm text-white transition bg-gray-900 rounded-lg hover:bg-gray-700"
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
                      className="px-4 py-2 text-sm text-gray-900 transition bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-white transition bg-gray-900 rounded-lg hover:bg-gray-700"
                  >
                    Edit Profile
                  </button>
                )
              ) : (
                <button
                  onClick={isSubscribed ? handleUnsubscribe : handleSubscribe}
                  className={`px-4 py-2 text-sm rounded-lg transition ${
                    isSubscribed 
                      ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100' 
                      : 'bg-gray-900 text-white hover:bg-gray-700'
                  }`}
                >
                  {isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="p-3 mt-4 text-sm text-red-600 rounded-lg bg-red-50">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 mt-4 text-sm text-green-600 rounded-lg bg-green-50">
              {success}
            </div>
          )}

          {/* Password Change */}
          {isEditing && (
            <div className="p-4 mt-6 bg-gray-100 rounded-lg">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">Change Password</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Current Password"
                />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="New Password"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 text-sm rounded-lg transition ${
                activeTab === 'videos' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Videos
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('liked')}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  activeTab === 'liked' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Liked
              </button>
            )}
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  activeTab === 'settings' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Settings
              </button>
            )}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 text-sm rounded-lg transition ${
                  activeTab === 'admin' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Admin
              </button>
            )}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'videos' && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Uploaded Videos</h2>
            {videos.length === 0 ? (
              <div className="py-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">No videos yet</h3>
                <p className="text-sm text-gray-500">This user hasn't uploaded any videos</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map(video => (
                  <div key={video.id} className="relative">
                    <VideoCard video={video} />
                    {isOwnProfile && (
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="absolute flex items-center justify-center w-8 h-8 text-white transition rounded-full top-2 right-2 bg-gray-900/70 hover:bg-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Liked Videos</h2>
            {likedVideos.length === 0 ? (
              <div className="py-10 text-center">
                <h3 className="text-sm font-medium text-gray-900">No liked videos</h3>
                <p className="text-sm text-gray-500">Videos you like will appear here</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {likedVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && isOwnProfile && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Account Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-900">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-900">Avatar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 file:bg-gray-900 file:text-white file:rounded-lg file:border-0 file:px-3 file:py-1 file:mr-3"
                />
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">Change Password</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-sm text-white transition bg-gray-900 rounded-lg hover:bg-gray-700"
                >
                  Save
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
                  className="flex-1 px-4 py-2 text-sm text-gray-900 transition bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Video Management</h2>
            <div className="mb-4">
              <select 
                value={adminFilters.status} 
                onChange={(e) => setAdminFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                <option value="">All Status</option>
                <option value="processing">Processing</option>
                <option value="published">Published</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Title</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Owner</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Status</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Views</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Likes</th>
                    <th className="px-4 py-2 text-xs font-medium text-left text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {adminVideos.map(video => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm text-gray-900">{video.title}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{video.username}</td>
                      <td className="px-4 py-2">
                        <select 
                          value={video.status} 
                          onChange={(e) => handleStatusChange(video.id, e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                        >
                          <option value="processing">Processing</option>
                          <option value="published">Published</option>
                          <option value="failed">Failed</option>
                        </select>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{video.views}</td>
                      <td className="px-4 py-2 text-sm text-gray-600">{video.like_count}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => setEditingVideo(video)}
                          className="px-3 py-1 text-sm text-gray-900 transition bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {adminPagination && adminPagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setAdminFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={adminPagination.currentPage === 1}
                  className="px-4 py-2 text-sm text-gray-900 transition bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {adminPagination.currentPage} of {adminPagination.totalPages}
                </span>
                <button
                  onClick={() => setAdminFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={adminPagination.currentPage === adminPagination.totalPages}
                  className="px-4 py-2 text-sm text-gray-900 transition bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Edit Video Modal */}
        {editingVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-sm p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-gray-900">Edit Video</h2>
                <button
                  onClick={() => setEditingVideo(null)}
                  className="flex items-center justify-center w-8 h-8 text-gray-900 transition bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleEditVideo(editingVideo.id, formData);
                }}
                encType="multipart/form-data"
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-900">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingVideo.title}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-900">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingVideo.description}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-gray-900"
                    rows="4"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-900">Category</label>
                    <input
                      type="text"
                      name="category"
                      defaultValue={editingVideo.category}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-900">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      defaultValue={editingVideo.tags ? JSON.parse(editingVideo.tags).join(', ') : ''}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-900">Video File</label>
                  <input
                    type="file"
                    name="video"
                    accept="video/*"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 file:bg-gray-900 file:text-white file:rounded-lg file:border-0 file:px-3 file:py-1 file:mr-3"
                  />
                  <p className="mt-1 text-xs text-gray-500 truncate">Current: {editingVideo.filename}</p>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-gray-900">Thumbnail</label>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900 file:bg-gray-900 file:text-white file:rounded-lg file:border-0 file:px-3 file:py-1 file:mr-3"
                  />
                  {editingVideo.thumbnail && (
                    <img
                      src={`http://localhost:5000/${editingVideo.thumbnail}`}
                      alt="Current thumbnail"
                      className="object-cover w-20 h-12 mt-2 border border-gray-200 rounded-lg"
                    />
                  )}
                </div>
                {(currentUser?.role === 'admin' || currentUser?.id === editingVideo.user_id) && (
                  <div>
                    <label className="block mb-1 text-xs font-medium text-gray-900">Status</label>
                    <select
                      name="status"
                      defaultValue={editingVideo.status}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-900"
                    >
                      <option value="processing">Processing</option>
                      <option value="published">Published</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                )}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setEditingVideo(null)}
                    className="flex-1 px-4 py-2 text-sm text-gray-900 transition bg-white border border-gray-200 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-sm text-white transition bg-gray-900 rounded-lg hover:bg-gray-700"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;