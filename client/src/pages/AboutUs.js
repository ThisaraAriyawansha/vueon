import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, Users, Sparkles, Globe, Heart, ArrowRight, Cpu, Code, Eye, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const pulseAnimation = {
  scale: [1, 1.05, 1],
  transition: { duration: 2, repeat: Infinity }
};

const orbitAnimation = {
  rotate: 360,
  transition: { duration: 20, repeat: Infinity, ease: "linear" }
};

const AboutUs = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-[#192f4a] to-[#003366]"
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#005691]/90 "></div>
        <motion.div 
          variants={fadeIn}
          className="container relative px-6 pt-32 pb-20 mx-auto mt-16 mb-4"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              variants={slideUp}
              className="mb-6 text-6xl font-thin tracking-tight text-white"
            >
              About <span className="font-semibold bg-gradient-to-r from-[#0077b6] to-[#add8e6] bg-clip-text text-transparent">Vueon</span>
            </motion.h1>
            <motion.p 
              variants={slideUp}
              className="text-xl text-[#add8e6] font-light leading-relaxed max-w-2xl mx-auto"
            >
              Where creativity meets community. We're building the future of content sharing, one story at a time.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* Mission Section with Image */}
      <section className="py-20 bg-white">
        <div className="container px-6 mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid items-center max-w-6xl gap-16 mx-auto lg:grid-cols-2"
          >
            <motion.div variants={slideUp}>
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
            </motion.div>
            <motion.div 
              variants={slideUp}
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="aspect-square bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-3xl p-16 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-white/20"
                    animate={pulseAnimation}
                  >
                    <Heart className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-light text-white">Connecting Hearts</h3>
                  <p className="text-[#add8e6] font-light">Through shared creativity</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#192f4a]">
        <div className="container px-6 mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid max-w-4xl gap-12 mx-auto md:grid-cols-3"
          >
            <motion.div variants={slideUp} className="text-center">
              <motion.div 
                className="text-5xl font-thin text-[#add8e6] mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100 }}
              >100K+</motion.div>
              <div className="font-light text-white">Creators</div>
            </motion.div>
            <motion.div variants={slideUp} className="text-center">
              <motion.div 
                className="text-5xl font-thin text-[#add8e6] mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
              >1M+</motion.div>
              <div className="font-light text-white">Videos Shared</div>
            </motion.div>
            <motion.div variants={slideUp} className="text-center">
              <motion.div 
                className="text-5xl font-thin text-[#add8e6] mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
              >50+</motion.div>
              <div className="font-light text-white">Countries</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              variants={slideUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mb-16 text-center"
            >
              <h2 className="text-4xl font-light text-[#192f4a] mb-6">What We Do</h2>
              <p className="max-w-2xl mx-auto text-xl font-light text-gray-600">
                We've reimagined content sharing from the ground up, focusing on what matters most: your creative expression.
              </p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid gap-8 md:grid-cols-3"
            >
              {/* Feature 1 */}
              <motion.div variants={slideUp} className="text-center group">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Upload className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Seamless Upload</h3>
                <p className="leading-relaxed text-gray-600">
                  Drag, drop, done. Our intelligent system handles the rest, from compression to thumbnail generation.
                </p>
              </motion.div>

              {/* Feature 2 */}
              <motion.div variants={slideUp} className="text-center group">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Play className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Discover Magic</h3>
                <p className="leading-relaxed text-gray-600">
                  Our AI-powered recommendation engine learns what you love and serves up content that inspires.
                </p>
              </motion.div>

              {/* Feature 3 */}
              <motion.div variants={slideUp} className="text-center group">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-[#0077b6] to-[#add8e6] rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Users className="w-12 h-12 text-white" />
                </motion.div>
                <h3 className="text-2xl font-light text-[#192f4a] mb-4">Build Community</h3>
                <p className="leading-relaxed text-gray-600">
                  Connect with creators who share your passions. Collaborate, learn, and grow together.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#005691] to-[#0077b6]">
        <div className="container px-6 mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h2 variants={slideUp} className="mb-6 text-4xl font-light text-white">Join the Movement</motion.h2>
            <motion.p variants={slideUp} className="text-xl text-[#add8e6] font-light mb-10 leading-relaxed">
              Ready to be part of something bigger? Your creative journey starts here.
            </motion.p>
            
            <motion.div variants={slideUp} className="flex flex-col justify-center gap-4 sm:flex-row">
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 bg-white md:py-32">
        <div className="container px-4 mx-auto sm:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="mx-auto max-w-7xl bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] rounded-3xl"
          >
            <div className="p-8 border shadow-2xl sm:p-12 md:p-16 backdrop-blur-xl bg-white/5 border-white/10 rounded-3xl">
              <div className="grid items-center gap-10 lg:gap-20 lg:grid-cols-2">
                <motion.div variants={slideUp}>
                  <h2 className="mb-6 text-3xl leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl font-ultralight">
                    Our <span className="font-medium text-[#add8e6]">Mission</span>
                  </h2>
                  <div className="space-y-4 text-base font-light leading-relaxed sm:text-lg text-white/80">
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
                  <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 sm:gap-6 sm:mt-12">
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-[#add8e6] rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium sm:text-sm text-white/70">Neural Networks</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-[#0077b6] rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium sm:text-sm text-white/70">Edge Computing</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-[#005691] rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium sm:text-sm text-white/70">Blockchain Security</span>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-2 h-2 bg-[#16599c] rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium sm:text-sm text-white/70">Quantum Encryption</span>
                    </motion.div>
                  </div>
                </motion.div>
                
                {/* 3D Tech Visualization */}
                <motion.div 
                  className="relative"
                  variants={slideUp}
                >
                  <div className="aspect-square bg-gradient-to-br from-[#003366]/30 to-[#0077b6]/30 rounded-3xl border border-white/10 backdrop-blur-sm p-6 sm:p-8 md:p-12 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Central Core */}
                      <motion.div 
                        className="absolute inset-1/2 w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#add8e6] to-[#0077b6] rounded-full shadow-2xl shadow-[#0077b6]/50"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      ></motion.div>
                      
                      {/* Orbiting Elements */}
                      <motion.div 
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <Brain className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#089fd1]" />
                        <Code className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#0899e7]" />
                        <Cpu className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#4787b1]" />
                        <Eye className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#2471be]" />
                      </motion.div>
                      
                      {/* Connection Lines */}
                      <svg className="absolute inset-0 w-full h-full">
                        <defs>
                          <linearGradient id="line-gradient">
                            <stop offset="0%" stopColor="#add8e6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#0077b6" stopOpacity="0.8"/>
                          </linearGradient>
                        </defs>
                        <path d="M50% 50% L80% 20% M50% 50% L80% 80% M50% 50% L20% 80% M50% 50% L20% 20%" 
                              stroke="url(#line-gradient)" 
                              strokeWidth="2" 
                              fill="none"
                              className="animate-pulse" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>  
    </motion.div>
  );
};

export default AboutUs;