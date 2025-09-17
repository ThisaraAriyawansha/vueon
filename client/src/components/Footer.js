import React from 'react';
import { Play, Upload, Share, Users, MapPin, Mail, Phone, Globe, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#add8e6] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#0077b6] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#add8e6] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="px-6 py-16 mx-auto max-w-7xl">
          {/* Top Section */}
          <div className="grid grid-cols-1 gap-12 mb-12 lg:grid-cols-3">
            
            {/* Company Info */}
            <div className="space-y-6 lg:col-span-1">
              {/* Logo and Branding */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img 
                      src="/logo2.png" 
                      alt="Vueon Logo"
                      className="w-auto h-12"
                      onError={(e) => {
                        // Fallback to a play icon if logo fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-12 h-12 bg-gradient-to-br from-[#0077b6] to-[#add8e6] rounded-2xl items-center justify-center">
                      <Play className="w-6 h-6 text-white fill-current" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-[#add8e6] to-white bg-clip-text text-transparent">
                      Vueon
                    </h3>
                    <p className="text-[#add8e6]/80 text-sm font-medium">THE ULTIMATE PLATFORM</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-[#add8e6]">UPLOAD & STREAM</h4>
                  <p className="text-sm leading-relaxed text-gray-300">
                    Upload, share, and stream your videos seamlessly with Vueon, the ultimate platform for creators and viewers.
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-3 text-[#add8e6]/90">
                <MapPin className="flex-shrink-0 w-5 h-5" />
                <span className="text-sm font-medium">Colombo, Sri Lanka</span>
              </div>
            </div>

            {/* Features & Services */}
            <div className="space-y-6 lg:col-span-1">
              <h4 className="text-xl font-bold text-[#add8e6] mb-6">Platform Features</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-10 h-10 bg-[#0077b6]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0077b6]/30 transition-colors duration-200">
                    <Upload className="w-5 h-5 text-[#add8e6]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white group-hover:text-[#add8e6] transition-colors">Video Upload</h5>
                    <p className="text-xs text-gray-400">Upload videos in multiple formats</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-10 h-10 bg-[#0077b6]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0077b6]/30 transition-colors duration-200">
                    <Play className="w-5 h-5 text-[#add8e6] fill-current" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white group-hover:text-[#add8e6] transition-colors">HD Streaming</h5>
                    <p className="text-xs text-gray-400">High-quality video streaming</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-10 h-10 bg-[#0077b6]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0077b6]/30 transition-colors duration-200">
                    <Share className="w-5 h-5 text-[#add8e6]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white group-hover:text-[#add8e6] transition-colors">Easy Sharing</h5>
                    <p className="text-xs text-gray-400">Share across all platforms</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 cursor-pointer group">
                  <div className="w-10 h-10 bg-[#0077b6]/20 rounded-xl flex items-center justify-center group-hover:bg-[#0077b6]/30 transition-colors duration-200">
                    <Users className="w-5 h-5 text-[#add8e6]" />
                  </div>
                  <div>
                    <h5 className="font-medium text-white group-hover:text-[#add8e6] transition-colors">Creator Community</h5>
                    <p className="text-xs text-gray-400">Connect with other creators</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Social */}
            <div className="space-y-6 lg:col-span-1">
              <h4 className="text-xl font-bold text-[#add8e6] mb-6">Connect With Us</h4>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-300 hover:text-[#add8e6] transition-colors cursor-pointer">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">contact@vueon.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-[#add8e6] transition-colors cursor-pointer">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+94 11 234 5678</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300 hover:text-[#add8e6] transition-colors cursor-pointer">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">www.vueon.com</span>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h5 className="text-sm font-semibold text-[#add8e6] mb-3">Follow Us</h5>
                <div className="flex space-x-3">
                  {[
                    { icon: Instagram, label: 'Instagram' },
                    { icon: Twitter, label: 'Twitter' },
                    { icon: Facebook, label: 'Facebook' },
                    { icon: Youtube, label: 'YouTube' }
                  ].map(({ icon: Icon, label }) => (
                    <button
                      key={label}
                      className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-[#add8e6]/20 hover:scale-110 transition-all duration-200 group"
                      aria-label={label}
                    >
                      <Icon className="w-4 h-4 text-[#add8e6] group-hover:text-white" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#add8e6]/30 to-transparent mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © 2024 Vueon. All rights reserved.
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Empowering creators worldwide
              </p>
            </div>

            <div className="flex flex-wrap justify-center space-x-6 text-xs md:justify-end">
              <button className="text-gray-400 hover:text-[#add8e6] transition-colors">Privacy Policy</button>
              <button className="text-gray-400 hover:text-[#add8e6] transition-colors">Terms of Service</button>
              <button className="text-gray-400 hover:text-[#add8e6] transition-colors">Support</button>
              <button className="text-gray-400 hover:text-[#add8e6] transition-colors">Careers</button>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        
      </div>
    </footer>
  );
};

export default Footer;