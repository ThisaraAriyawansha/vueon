import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, Users, Sparkles, Globe, Heart, ArrowRight,  Cpu, Code, Eye, Brain } from 'lucide-react';


const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#192f4a] to-[#003366]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#005691]/90"></div>
        <div className="container relative px-6 pt-32 pb-20 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="mb-6 text-6xl font-thin tracking-tight text-white">
              About <span className="font-semibold bg-gradient-to-r from-[#0077b6] to-[#add8e6] bg-clip-text text-transparent">Vueon</span>
            </h1>
            <p className="text-xl text-[#add8e6] font-light leading-relaxed max-w-2xl mx-auto">
              Where creativity meets community. We're building the future of content sharing, one story at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="py-20 bg-white">
        <div className="container px-6 mx-auto">
          <div className="grid items-center max-w-6xl gap-16 mx-auto lg:grid-cols-2">
            <div>
              <h2 className="text-4xl font-light text-[#192f4a] mb-6">Our Mission</h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                At Vueon, we believe every creator has a unique voice that deserves to be heard. 
                We're building more than a platform – we're crafting a movement that celebrates 
                human creativity in all its forms.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                From the bedroom producer to the seasoned filmmaker, from the weekend hobbyist 
                to the professional artist – Vueon is where your story finds its audience.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-3xl p-16 flex items-center justify-center">
                <div className="text-center">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-white/20">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-light text-white">Connecting Hearts</h3>
                  <p className="text-[#add8e6] font-light">Through shared creativity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#192f4a]">
        <div className="container px-6 mx-auto">
          <div className="grid max-w-4xl gap-12 mx-auto md:grid-cols-3">
            <div className="text-center">
              <div className="text-5xl font-thin text-[#add8e6] mb-4">100K+</div>
              <div className="font-light text-white">Creators</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-thin text-[#add8e6] mb-4">1M+</div>
              <div className="font-light text-white">Videos Shared</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-thin text-[#add8e6] mb-4">50+</div>
              <div className="font-light text-white">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-light text-[#192f4a] mb-6">What We Do</h2>
              <p className="max-w-2xl mx-auto text-xl font-light text-gray-600">
                We've reimagined content sharing from the ground up, focusing on what matters most: your creative expression.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Seamless Upload</h3>
                <p className="leading-relaxed text-gray-600">
                  Drag, drop, done. Our intelligent system handles the rest, from compression to thumbnail generation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Discover Magic</h3>
                <p className="leading-relaxed text-gray-600">
                  Our AI-powered recommendation engine learns what you love and serves up content that inspires.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-[#0077b6] to-[#add8e6] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Build Community</h3>
                <p className="leading-relaxed text-gray-600">
                  Connect with creators who share your passions. Collaborate, learn, and grow together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values Section */}
      <section className="py-20 bg-[#003366]">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="mb-6 text-4xl font-light text-white">Our Values</h2>
              <p className="text-xl text-[#add8e6] font-light">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center mb-4">
                  <Sparkles className="w-8 h-8 text-[#add8e6] mr-4" />
                  <h3 className="text-2xl font-light text-white">Innovation First</h3>
                </div>
                <p className="text-[#add8e6] leading-relaxed">
                  We push boundaries and challenge conventions to create experiences that didn't exist before.
                </p>
              </div>

              <div className="p-8 bg-white/5 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center mb-4">
                  <Globe className="w-8 h-8 text-[#add8e6] mr-4" />
                  <h3 className="text-2xl font-light text-white">Global Impact</h3>
                </div>
                <p className="text-[#add8e6] leading-relaxed">
                  Every feature we build considers its impact on creators worldwide, regardless of their background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#005691] to-[#0077b6]">
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6 text-4xl font-light text-white">Join the Movement</h2>
            <p className="text-xl text-[#add8e6] font-light mb-10 leading-relaxed">
              Ready to be part of something bigger? Your creative journey starts here.
            </p>
            
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center px-8 py-4 bg-white text-[#005691] rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
              >
                Start Creating
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#005691] transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-32 bg-white">
        <div className="container px-6 mx-auto ">
          <div className="mx-auto max-w-7xl bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] rounded-3xl">
            <div className="p-16 border shadow-2xl backdrop-blur-xl bg-white/5 border-white/10 rounded-3xl ">
              <div className="grid items-center gap-20 lg:grid-cols-2 ">
                <div>
                  <h2 className="mb-8 text-6xl leading-tight text-white font-ultralight">
                    Our <span className="font-medium text-[#add8e6]">Mission</span>
                  </h2>
                  <div className="space-y-6 text-lg font-light leading-relaxed text-white/80">
                    <p>
                      We're engineering the future of human creativity. Through advanced AI, 
                      quantum-fast processing, and intuitive design, we're building more than 
                      a platform—we're architecting a new creative ecosystem.
                    </p>
                    <p>
                      Every line of code, every pixel, every interaction is crafted to amplify 
                      human potential. This is creativity, reimagined for the digital age.
                    </p>
                  </div>
                  
                  {/* Tech Highlights */}
                  <div className="grid grid-cols-2 gap-6 mt-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#add8e6] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white/70">Neural Networks</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#0077b6] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white/70">Edge Computing</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#005691] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white/70">Blockchain Security</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#003366] rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-white/70">Quantum Encryption</span>
                    </div>
                  </div>
                </div>
                
                {/* 3D Tech Visualization */}
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-[#003366]/30 to-[#0077b6]/30 rounded-3xl border border-white/10 backdrop-blur-sm p-12 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Central Core */}
                      <div className="absolute inset-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#add8e6] to-[#0077b6] rounded-full animate-pulse shadow-2xl shadow-[#0077b6]/50"></div>
                      
                      {/* Orbiting Elements */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                        <Brain className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 text-[#add8e6]" />
                        <Code className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[#0077b6]" />
                        <Cpu className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 text-[#005691]" />
                        <Eye className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 text-[#003366]" />
                      </div>
                      
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="line-gradient">
                            <stop offset="0%" stopColor="#add8e6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#0077b6" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <path d="M50,50 L80,20 M50,50 L80,80 M50,50 L20,80 M50,50 L20,20" 
                              stroke="url(#line-gradient)" 
                              strokeWidth="2" 
                              fill="none"
                              className="animate-pulse" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>     
    </div>
  );
};

export default AboutUs;