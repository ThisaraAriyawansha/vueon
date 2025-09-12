import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('videos');
  
  const { id } = useParams();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [userResponse, videosResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/users/${id}`),
          axios.get(`http://localhost:5000/api/users/${id}/videos`)
        ]);
        
        setUser(userResponse.data);
        setVideos(videosResponse.data);
      } catch (error) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-12 h-12 border-b-2 rounded-full animate-spin border-highlight"></div>
        </div>
      </div>
    );
  }

  if (error || !user) {
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
          <img 
            src={user.avatar || '/default-avatar.png'} 
            alt={user.username}
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-bold text-primary">{user.username}</h1>
            <p className="mt-2 text-gray-600">{user.email}</p>
            <div className="flex mt-4 space-x-6 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-primary">{videos.length}</span> videos
              </div>
              <div>
                <span className="font-semibold text-primary">0</span> subscribers
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default Profile;