import React from 'react';
import { Shield, Zap, Home, Award } from 'lucide-react';
import { Play, Upload, Share, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Main content */}
      <div className="container relative z-10 px-4 py-12 mx-auto lg:py-20">
        <div className="grid items-center min-h-screen gap-12 lg:grid-cols-2">
          
          {/* Left content */}
          <div className="mt-16 ml-8 space-y-8 text-white md:mt-0">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-wide uppercase text-cyan-400">
                THE ULTIMATE PLATFORM
              </p>
              <h1 className="text-3xl font-bold leading-snug lg:text-5xl">
                UPLOAD & STREAM
                <span className="block text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text">
                  Vueon
                </span>
              </h1>
            </div>

            <p className="max-w-md text-base leading-relaxed text-gray-300">
              Upload, share, and stream your videos seamlessly with Vueon, the ultimate platform for creators and viewers.
            </p>

            
            <div className="flex flex-wrap gap-4">
            <button className="flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-all duration-300 transform border border-white rounded-full shadow-md bg-primary bg-opacity-90 backdrop-blur-md hover:scale-105">
              <span>Start Streaming</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
            </div>
          </div>
          
          {/* Right content - Video Streaming Visual */}
          <div className="relative">
            {/* Video player mockup */}
            <div className="relative w-full max-w-md mx-auto overflow-hidden shadow-2xl rounded-xl bg-slate-800">
              {/* Video screen with gradient overlay */}
              <div className="relative h-64 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 bg-red-600 rounded-full shadow-lg cursor-pointer hover:bg-red-700 hover:scale-110">
                    <Play className="w-8 h-8 ml-1 text-white" fill="white" />
                  </div>
                </div>
                
                {/* Video progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div className="h-full bg-red-500" style={{width: '35%'}}></div>
                </div>
                
                {/* Video controls */}
                <div className="absolute flex items-center justify-between bottom-3 left-3 right-3">
                  <span className="text-xs text-white">1:24 / 4:16</span>
                  <div className="flex space-x-2">
                    <div className="p-1 rounded hover:bg-white/10">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </div>
                    <div className="p-1 rounded hover:bg-white/10">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video info section */}
              <div className="p-4 bg-slate-800">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">Amazing Travel Vlog - Bali 2023</h3>
                    <p className="text-sm text-gray-400">Adventure Seekers • 245K views</p>
                    <div className="flex items-center mt-2 space-x-4">
                      <div className="flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        2.4K
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        348
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating video thumbnails */}
            <div className="absolute w-32 h-20 overflow-hidden transform rounded-lg shadow-lg -left-10 top-10 bg-gradient-to-r from-orange-600 to-red-600 rotate-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            
            <div className="absolute w-32 h-20 overflow-hidden transform rounded-lg shadow-lg -right-10 bottom-10 bg-gradient-to-r from-purple-600 to-pink-600 -rotate-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
            </div>
            
            {/* Streaming indicators */}
            <div className="absolute top-0 right-0 flex items-center px-3 py-1 space-x-1 bg-red-600 rounded-full shadow-md">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white">LIVE</span>
            </div>
            
            {/* View count indicator */}
            <div className="absolute bottom-0 left-0 flex items-center px-3 py-1 space-x-1 rounded-full shadow-md bg-black/70">
              <Users className="w-4 h-4 text-white" />
              <span className="text-xs font-medium text-white">12.5K watching</span>
            </div>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-6 mt-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Easy Upload */}
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-110">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Easy Upload</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Drag and drop your videos for instant upload. Support for all major video formats and resolutions.
            </p>
          </div>
          
          {/* HD Streaming */}
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl group-hover:scale-110">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">HD Streaming</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Crystal clear HD streaming with adaptive quality that adjusts to your connection speed.
            </p>
          </div>
          
          {/* Global Sharing */}
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110">
              <Share className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Global Sharing</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Share your content worldwide with built-in social media integration and embed options.
            </p>
          </div>
          
          {/* Community Driven */}
          <div className="p-6 transition-all duration-300 border bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-transform duration-300 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl group-hover:scale-110">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Community Driven</h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Connect with creators and viewers in our vibrant community with comments, likes, and subscriptions.
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute w-32 h-32 rounded-full top-20 right-20 bg-cyan-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute w-24 h-24 delay-1000 rounded-full bottom-20 left-20 bg-red-500/20 blur-2xl animate-pulse"></div>
    </div>
  );
};

export default HeroSection;