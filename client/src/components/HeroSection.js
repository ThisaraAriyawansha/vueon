import React, { useState, useEffect } from 'react';
import { Play, Upload, Share, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";


const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Animation variants for cleaner code
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  const featureCardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };
  
  const floatingVariants = {
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };
  
  const rotateVariants = {
    animate: {
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute w-32 h-32 rounded-full top-20 right-20 bg-cyan-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute w-24 h-24 rounded-full bottom-20 left-20 bg-red-500/20 blur-2xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Main content */}
      <div className="container relative z-10 px-4 py-12 mx-auto lg:py-20">
        <motion.div 
          className="grid items-center min-h-screen gap-12 lg:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Left content */}
          <motion.div className="mt-16 ml-8 space-y-8 text-white md:mt-0" variants={itemVariants}>
            <div className="space-y-2">
              <motion.p 
                className="text-xs font-medium tracking-wide uppercase text-cyan-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                THE ULTIMATE PLATFORM
              </motion.p>
              <motion.h1 
                className="text-3xl font-bold leading-snug lg:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                UPLOAD & STREAM
                <motion.span 
                  className="block text-transparent bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Vueon
                </motion.span>
              </motion.h1>
            </div>

            <motion.p 
              className="max-w-md text-base leading-relaxed text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              Upload, share, and stream your videos seamlessly with Vueon, the ultimate platform for creators and viewers.
            </motion.p>

            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
            <Link to="/login">
              <motion.button 
                className="flex items-center justify-center px-4 py-2 space-x-2 text-sm font-medium text-white transition-all duration-300 transform border border-white rounded-full shadow-md bg-primary bg-opacity-90 backdrop-blur-md hover:scale-105"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
              </motion.button>
            </Link>
            </motion.div>
          </motion.div>
          
          {/* Right content - Video Streaming Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            {/* Video player mockup */}
            <motion.div 
              className="relative w-full max-w-md mx-auto overflow-hidden shadow-2xl rounded-xl bg-slate-800"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Video screen with gradient overlay */}
              <div className="relative h-64 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-800">
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="flex items-center justify-center w-16 h-16 transition-all duration-300 bg-red-600 rounded-full shadow-lg cursor-pointer hover:bg-red-700 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    <motion.div
                      animate={{ rotate: isPlaying ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Play className="w-8 h-8 ml-1 text-white" fill="white" />
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Video progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <motion.div 
                    className="h-full bg-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: '35%' }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
                
                {/* Video controls */}
                <div className="absolute flex items-center justify-between bottom-3 left-3 right-3">
                  <span className="text-xs text-white">1:24 / 4:16</span>
                  <div className="flex space-x-2">
                    <motion.div 
                      className="p-1 rounded hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </motion.div>
                    <motion.div 
                      className="p-1 rounded hover:bg-white/10"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Video info section */}
                <div className="p-4 bg-[#192f4a]">
                  <div className="flex items-start space-x-3">
                    {/* Logo / Avatar */}
                  <motion.div 
                    className="flex items-center justify-center w-10 h-10 overflow-hidden rounded-full"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img 
                      src="/logo2.png" 
                      alt="Vueon Logo" 
                      className="object-contain w-8 h-8"
                    />
                  </motion.div>



                    {/* Video Info */}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">Vueon Exclusive Showcase</h3>
                      <p className="text-sm text-[#add8e6]">Vueon Official • 120K views</p>

                      {/* Stats */}
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-sm text-[#add8e6]">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                          8.2K
                        </div>
                        <div className="flex items-center text-sm text-[#add8e6]">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          512
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

            </motion.div>
            
            {/* Floating video thumbnails */}
            <motion.div 
              className="absolute w-20 overflow-hidden transform rounded-lg shadow-lg h-14 sm:w-32 sm:h-20 -left-6 top-6 sm:-left-10 sm:top-10 bg-gradient-to-r from-orange-600 to-red-600 rotate-6"
              variants={floatingVariants}
              animate="animate"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="w-4 h-4 text-white sm:w-5 sm:h-5" fill="white" />
              </div>
            </motion.div>

            
          <motion.div 
            className="absolute w-20 overflow-hidden transform rounded-lg shadow-lg h-14 sm:w-32 sm:h-20 -right-6 bottom-6 sm:-right-10 sm:bottom-10 bg-gradient-to-r from-purple-600 to-pink-600 -rotate-6"
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className="w-4 h-4 text-white sm:w-5 sm:h-5" fill="white" />
            </div>
          </motion.div>

            
            {/* Streaming indicators */}
            <motion.div 
              className="absolute top-0 right-0 flex items-center px-3 py-1 space-x-1 bg-red-600 rounded-full shadow-md"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15, delay: 1 }}
            >
              <motion.div 
                className="w-2 h-2 bg-white rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-white">LIVE</span>
            </motion.div>
            
            {/* View count indicator */}
            <motion.div 
              className="absolute left-0 flex items-center px-2 py-0.5 sm:px-3 sm:py-1 space-x-1 rounded-full shadow-md -bottom-3 sm:-bottom-4 bg-black/70"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Users className="w-3 h-3 text-white sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-medium text-white">
                12.5K watching
              </span>
            </motion.div>

          </motion.div>
        </motion.div>
        
        {/* Feature cards */}
        <motion.div 
          className="grid grid-cols-1 gap-4 px-4 mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Easy Upload */}
          <motion.div 
            className="p-4 transition-all duration-300 border sm:p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group"
            variants={featureCardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="flex items-center justify-center w-10 h-10 mb-4 transition-transform duration-300 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl group-hover:scale-105"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Upload className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </motion.div>
            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">Easy Upload</h3>
            <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
              Drag and drop your videos for instant upload. Supports all major video formats and resolutions.
            </p>
          </motion.div>
          
          {/* HD Streaming */}
          <motion.div 
            className="p-4 transition-all duration-300 border sm:p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group"
            variants={featureCardVariants}
            whileHover="hover"
            transition={{ delay: 0.1 }}
          >
            <motion.div 
              className="flex items-center justify-center w-10 h-10 mb-4 transition-transform duration-300 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl group-hover:scale-105"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Play className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </motion.div>
            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">HD Streaming</h3>
            <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
              Crystal-clear HD streaming with adaptive quality for any connection speed.
            </p>
          </motion.div>
          
          {/* Global Sharing */}
          <motion.div 
            className="p-4 transition-all duration-300 border sm:p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group"
            variants={featureCardVariants}
            whileHover="hover"
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center justify-center w-10 h-10 mb-4 transition-transform duration-300 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-105"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Share className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </motion.div>
            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">Global Sharing</h3>
            <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
              Share content globally with seamless social media integration and embeds.
            </p>
          </motion.div>
          
          {/* Community Driven */}
          <motion.div 
            className="p-4 transition-all duration-300 border sm:p-6 bg-white/10 backdrop-blur-sm border-white/20 rounded-2xl hover:bg-white/20 group"
            variants={featureCardVariants}
            whileHover="hover"
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="flex items-center justify-center w-10 h-10 mb-4 transition-transform duration-300 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl group-hover:scale-105"
              whileHover={{ rotate: 5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Users className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </motion.div>
            <h3 className="mb-2 text-base font-semibold text-white sm:text-lg">Community Driven</h3>
            <p className="text-xs leading-relaxed text-gray-300 sm:text-sm">
              Connect with creators and viewers through comments, likes, and subscriptions.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;