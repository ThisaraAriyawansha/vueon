import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import VideoCard from '../components/VideoCard';
import HeroSection from '../components/HeroSection';
import VideoSection from './HomeComponent/VideoSection';
import LogoSection from './HomeComponent/LogoSection';
import VueonVideo from "../assets/video/Generated File September 18, 2025 - 9_00AM.mp4";
import {  Upload, Users, TrendingUp,  Shield, Zap, Globe,  ArrowRight, CheckCircle, BarChart3, Heart, Eye } from 'lucide-react';
import Banner from './HomeComponent/Banner';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { name: "Sarah Chen", role: "Content Creator", text: "Vueon has transformed how I share my creative work. The platform is intuitive and powerful.", avatar: "SC" },
    { name: "Marcus Johnson", role: "Filmmaker", text: "The streaming quality and creator tools on Vueon are unmatched. It's become my go-to platform.", avatar: "MJ" },
    { name: "Elena Rodriguez", role: "Educator", text: "Perfect for sharing educational content. My students love the seamless viewing experience.", avatar: "ER" }
  ];

  const stats = [
    { number: "1M+", label: "Active Creators", icon: Users },
    { number: "50M+", label: "Monthly Views", icon: Eye },
    { number: "99.9%", label: "Uptime", icon: Shield },
    { number: "150+", label: "Countries", icon: Globe }
  ];

  const features = [
    {
      icon: Upload,
      title: "Instant Upload",
      description: "Drag, drop, and publish your videos in seconds with our advanced compression technology.",
      color: "from-[#005691] to-[#0077b6]"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Global CDN ensures your content loads instantly anywhere in the world.",
      color: "from-[#0077b6] to-[#add8e6]"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights into your audience engagement and content performance.",
      color: "from-[#003366] to-[#005691]"
    }
  ];

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos');
        setVideos(response.data);
      } catch (error) {
        setError('Failed to load videos');
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="bg-white">
      {/* Hero Section */}
      <HeroSection />
      <LogoSection/>
      <VideoSection/>


      {/* Stats Section */}
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 md:py-20">
      <div className="container px-4 mx-auto md:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-xl group-hover:scale-105 transition-transform duration-300 md:w-16 md:h-16 md:mb-4 md:rounded-2xl md:group-hover:scale-110">
                <stat.icon className="w-5 h-5 text-white md:w-7 md:h-7" />
              </div>
              <div className="text-2xl font-light text-[#192f4a] mb-1 md:text-3xl md:mb-2">{stat.number}</div>
              <div className="text-xs text-[#005691] font-medium md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>



      {/* Featured Content Section */}
        <section className="py-20 bg-white">
          <div className="container px-6 mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-[#192f4a] mb-4">Trending Now</h2>
              <p className="text-[#005691] text-lg max-w-2xl mx-auto">
                Discover the most engaging content from our creative community
              </p>
            </div>

            {/* Video Grid */}
            {videos && videos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
                {videos.slice(0, 8).map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <div className="mb-12 text-center text-gray-500">
                <p>No trending videos available right now.</p>
              </div>
            )}

            {/* Button */}
            <div className="text-center">
              <Link to="/trending">
                <button className="inline-flex items-center px-8 py-3 bg-[#192f4a] text-white rounded-full hover:bg-[#003366] transition-all duration-300 group">
                  <span>Explore All Videos</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>
        </section>


      <Banner/>

      {/* Features Showcase */}
      <section className="py-8 bg-gray-50 md:py-20">
        <div className="container px-3 mx-auto md:px-6">
          <div className="mb-8 text-center md:mb-16">
            <h2 className="text-xl font-light text-[#192f4a] mb-2 md:text-4xl md:mb-4">Built for Creators</h2>
            <p className="text-[#005691] text-sm md:text-lg">Professional tools that scale with your ambitions</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-4 transition-all duration-500 bg-white shadow-sm rounded-xl hover:shadow-xl group md:p-8 md:rounded-3xl">
                <div className={`inline-flex items-center justify-center w-10 h-10 mb-3 bg-gradient-to-br ${feature.color} rounded-lg group-hover:scale-105 transition-transform duration-300 md:w-16 md:h-16 md:mb-6 md:rounded-2xl md:group-hover:scale-110`}>
                  <feature.icon className="w-4 h-4 text-white md:w-7 md:h-7" />
                </div>
                <h3 className="text-base font-semibold text-[#192f4a] mb-2 md:text-xl md:mb-4">{feature.title}</h3>
                <p className="text-[#005691] text-xs leading-relaxed md:text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Spotlight */}
      <section className="py-12 bg-gradient-to-br from-[#192f4a] to-[#003366] text-white relative overflow-hidden md:py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10 px-4 mx-auto md:px-6">
          <div className="grid items-center grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h2 className="mb-4 text-xl font-light md:text-4xl md:mb-6">Join the Creator Economy</h2>
              <p className="text-sm text-[#add8e6] mb-6 leading-relaxed md:text-xl md:mb-8">
                Turn your passion into profit with our comprehensive creator program, offering revenue sharing, 
                brand partnerships, and growth tools.
              </p>
              <div className="mb-6 space-y-3 md:mb-8 md:space-y-4">
                {["Monetization tools", "Brand collaboration platform", "Detailed analytics", "Community support"].map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 md:space-x-3">
                    <CheckCircle className="w-4 h-4 text-[#add8e6] md:w-5 md:h-5" />
                    <span className="text-xs md:text-base">{item}</span>
                  </div>
                ))}
              </div>
              <Link to="/login">
                <button className="px-4 py-1.5 text-[0.65rem] font-semibold text-white transition-all duration-300 border border-white rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 md:px-6 md:py-2 md:text-base">
                  Become a Creator
                </button>
              </Link>
            </div>
            <div className="relative">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl md:p-8 md:rounded-3xl">
                {/* Video Player */}
                <div className="mb-4 overflow-hidden aspect-video rounded-xl md:mb-6 md:rounded-2xl">
                  <video
                    src={VueonVideo}
                    className="object-cover w-full h-full rounded-xl md:rounded-2xl"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* Company Info */}
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-8 h-8  rounded-full flex items-center justify-center text-[#192f4a] font-semibold text-[0.65rem] md:w-10 md:h-10 md:text-sm">
                    <img 
                      src="/logo2.png" 
                      alt="Vueon Logo" 
                      className="object-contain w-8 h-8"
                    />                      
                    </div>
                    <div>
                      <div className="text-xs font-semibold md:text-base">Vueon</div>
                      <div className="text-[0.65rem] text-[#add8e6] md:text-sm">Official Platform</div>
                    </div>
                  </div>
                  <div className="text-[0.65rem] text-[#add8e6] md:text-sm">
                    Latest: "The Ultimate Video Streaming Experience"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white md:py-20">
        <div className="container px-4 mx-auto md:px-6">
          <div className="mb-8 text-center md:mb-16">
            <h2 className="text-2xl font-light text-[#192f4a] mb-3 md:text-4xl md:mb-4">Loved by Creators</h2>
            <p className="text-[#005691] text-sm md:text-lg">See what our community has to say</p>
          </div>
          
          <div className="max-w-3xl mx-auto md:max-w-4xl">
            <div className="relative p-6 overflow-hidden text-center bg-gray-50 rounded-2xl md:p-12 md:rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#add8e6]/10 to-[#005691]/10"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-sm md:w-16 md:h-16 md:mb-6 md:text-lg">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <blockquote className="text-base text-[#192f4a] mb-4 italic md:text-xl md:mb-6">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="font-semibold text-sm text-[#192f4a] md:text-base">{testimonials[currentTestimonial].name}</div>
                <div className="text-[#005691] text-xs md:text-base">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>
            
            <div className="flex justify-center mt-6 space-x-2 md:mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 md:w-3 md:h-3 ${
                    index === currentTestimonial ? 'bg-[#005691]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="py-12 bg-gradient-to-b from-gray-50 to-white md:py-20">
        <div className="container px-4 mx-auto md:px-6">
          <div className="mb-8 text-center md:mb-16">
            <h2 className="text-2xl font-light text-[#192f4a] mb-3 md:text-4xl md:mb-4">Why Choose Vueon?</h2>
            <p className="text-[#005691] text-sm max-w-xl mx-auto md:text-lg md:max-w-2xl">Experience the difference with our cutting-edge platform</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 md:gap-8">
            <div className="p-6 text-center transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg md:p-8 md:rounded-3xl">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-xl md:w-16 md:h-16 md:mb-6 md:rounded-2xl">
                <Shield className="w-5 h-5 text-white md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg font-semibold text-[#192f4a] mb-3 md:text-xl md:mb-4">Secure & Reliable</h3>
              <p className="text-[#005691] text-sm md:text-base">Enterprise-grade security with 99.9% uptime guarantee for your content.</p>
            </div>
            
            <div className="p-6 text-center transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg md:p-8 md:rounded-3xl">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-[#0077b6] to-[#add8e6] rounded-xl md:w-16 md:h-16 md:mb-6 md:rounded-2xl">
                <TrendingUp className="w-5 h-5 text-white md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg font-semibold text-[#192f4a] mb-3 md:text-xl md:mb-4">Growth Focused</h3>
              <p className="text-[#005691] text-sm md:text-base">AI-powered recommendations and analytics to help you reach more viewers.</p>
            </div>
            
            <div className="p-6 text-center transition-all duration-300 bg-white shadow-sm rounded-2xl hover:shadow-lg md:p-8 md:rounded-3xl">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-br from-[#003366] to-[#005691] rounded-xl md:w-16 md:h-16 md:mb-6 md:rounded-2xl">
                <Heart className="w-5 h-5 text-white md:w-7 md:h-7" />
              </div>
              <h3 className="text-lg font-semibold text-[#192f4a] mb-3 md:text-xl md:mb-4">Community First</h3>
              <p className="text-[#005691] text-sm md:text-base">Build meaningful connections with viewers and fellow creators.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default Home;