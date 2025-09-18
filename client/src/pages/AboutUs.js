import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Upload, Users, Sparkles, Globe, Heart, ArrowRight, Cpu, Code, Eye, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Headphones, Radio, Mic, Volume2 } from 'lucide-react';


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
            <div className="absolute inset-0 bg-gradient-to-r from-[#003366]/90 to-[#005691]/90"></div>
            <motion.div 
              variants={fadeIn}
              className="container relative px-4 pt-16 pb-12 mx-auto mt-16 mb-8 md:px-6 md:pt-32 md:pb-20 md:mt-16 md:mb-8"
            >
              <div className="max-w-3xl mx-auto text-center md:max-w-4xl">
                <motion.h1 
                  variants={slideUp}
                  className="mb-4 text-3xl font-thin tracking-tight text-white md:text-6xl md:mb-6"
                >
                  About <span className="font-semibold bg-gradient-to-r from-[#0077b6] to-[#add8e6] bg-clip-text text-transparent">Vueon</span>
                </motion.h1>
                <motion.p 
                  variants={slideUp}
                  className="text-base text-[#add8e6] font-light leading-relaxed max-w-xl mx-auto md:text-xl md:max-w-2xl"
                >
                  Where creativity meets community. We're building the future of content sharing, one story at a time.
                </motion.p>
              </div>
            </motion.div>
          </section>

              {/* Mission Section with Image */}
        <section className="py-12 bg-white md:py-20">
          <div className="container px-4 mx-auto md:px-6">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid items-center max-w-4xl gap-8 mx-auto md:gap-12 lg:grid-cols-2 lg:max-w-6xl"
            >
              <motion.div variants={slideUp}>
                <h2 className="text-2xl font-light text-[#192f4a] mb-4 md:text-4xl md:mb-6">Our Mission</h2>
                <p className="mb-4 text-sm leading-relaxed text-gray-600 md:text-lg md:mb-6">
                  At Vueon, we believe every creator has a unique voice that deserves to be heard. 
                  We're building more than a platform – we're crafting a movement that celebrates 
                  human creativity in all its forms.
                </p>
                <p className="text-sm leading-relaxed text-gray-600 md:text-lg">
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
                <div className="aspect-square bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-2xl p-8 flex items-center justify-center md:p-16 md:rounded-3xl">
                  <div className="text-center">
                    <motion.div 
                      className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20 md:w-20 md:h-20 md:mb-6"
                      animate={pulseAnimation}
                    >
                      <Heart className="w-8 h-8 text-white md:w-10 md:h-10" />
                    </motion.div>
                    <h3 className="mb-3 text-lg font-light text-white md:text-2xl md:mb-4">Connecting Hearts</h3>
                    <p className="text-[#add8e6] text-sm font-light md:text-base">Through shared creativity</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

              {/* Stats Section */}
        <section className="py-8 bg-[#192f4a] md:py-16">
          <div className="container px-4 mx-auto md:px-6">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid max-w-xl grid-cols-1 gap-8 mx-auto md:grid-cols-3 md:gap-12 md:max-w-4xl"
            >
              <motion.div variants={slideUp} className="text-center">
                <motion.div 
                  className="text-3xl font-thin text-[#add8e6] mb-3 md:text-5xl md:mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100 }}
                >100K+</motion.div>
                <div className="text-sm font-light text-white md:text-base">Creators</div>
              </motion.div>
              <motion.div variants={slideUp} className="text-center">
                <motion.div 
                  className="text-3xl font-thin text-[#add8e6] mb-3 md:text-5xl md:mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                >1M+</motion.div>
                <div className="text-sm font-light text-white md:text-base">Videos Shared</div>
              </motion.div>
              <motion.div variants={slideUp} className="text-center">
                <motion.div 
                  className="text-3xl font-thin text-[#add8e6] mb-3 md:text-5xl md:mb-4"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                >50+</motion.div>
                <div className="text-sm font-light text-white md:text-base">Countries</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

                {/* What We Do Section */}
          <section className="py-12 bg-gradient-to-b from-white to-gray-50 md:py-20">
            <div className="container px-4 mx-auto md:px-6">
              <div className="max-w-4xl mx-auto md:max-w-6xl">
                <motion.div 
                  variants={slideUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mb-8 text-center md:mb-16"
                >
                  <h2 className="text-2xl font-light text-[#192f4a] mb-4 md:text-4xl md:mb-6">What We Do</h2>
                  <p className="max-w-xl mx-auto text-sm font-light text-gray-600 md:text-xl md:max-w-2xl">
                    We've reimagined content sharing from the ground up, focusing on what matters most: your creative expression.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid gap-6 md:grid-cols-3 md:gap-8"
                >
                  {/* Feature 1 */}
                  <motion.div variants={slideUp} className="text-center group">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-[#0077b6] to-[#005691] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 md:w-24 md:h-24 md:mb-6 md:rounded-3xl md:group-hover:scale-110"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Upload className="w-8 h-8 text-white md:w-12 md:h-12" />
                    </motion.div>
                    <h3 className="text-xl font-light text-[#192f4a] mb-3 md:text-2xl md:mb-4">Seamless Upload</h3>
                    <p className="text-xs leading-relaxed text-gray-600 md:text-base">
                      Drag, drop, done. Our intelligent system handles the rest, from compression to thumbnail generation.
                    </p>
                  </motion.div>

                  {/* Feature 2 */}
                  <motion.div variants={slideUp} className="text-center group">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-[#005691] to-[#0077b6] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 md:w-24 md:h-24 md:mb-6 md:rounded-3xl md:group-hover:scale-110"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Play className="w-8 h-8 text-white md:w-12 md:h-12" />
                    </motion.div>
                    <h3 className="text-xl font-light text-[#192f4a] mb-3 md:text-2xl md:mb-4">Discover Magic</h3>
                    <p className="text-xs leading-relaxed text-gray-600 md:text-base">
                      Our AI-powered recommendation engine learns what you love and serves up content that inspires.
                    </p>
                  </motion.div>

                  {/* Feature 3 */}
                  <motion.div variants={slideUp} className="text-center group">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-br from-[#0077b6] to-[#add8e6] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 md:w-24 md:h-24 md:mb-6 md:rounded-3xl md:group-hover:scale-110"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Users className="w-8 h-8 text-white md:w-12 md:h-12" />
                    </motion.div>
                    <h3 className="text-xl font-light text-[#192f4a] mb-3 md:text-2xl md:mb-4">Build Community</h3>
                    <p className="text-xs leading-relaxed text-gray-600 md:text-base">
                      Connect with creators who share your passions. Collaborate, learn, and grow together.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

      {/* CTA Section */}
    <section className="py-12 bg-gradient-to-r from-[#005691] to-[#0077b6] md:py-20">
      <div className="container px-4 mx-auto md:px-6">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center md:max-w-4xl"
        >
          <motion.h2 variants={slideUp} className="mb-4 text-2xl font-light text-white md:text-4xl md:mb-6">Join the Movement</motion.h2>
          <motion.p variants={slideUp} className="text-sm text-[#add8e6] font-light mb-6 leading-relaxed md:text-xl md:mb-10">
            Ready to be part of something bigger? Your creative journey starts here.
          </motion.p>
          
          <motion.div variants={slideUp} className="flex flex-col justify-center gap-3 sm:flex-row md:gap-4">
            <Link
              to="/register"
              className="group inline-flex items-center px-6 py-2.5 text-sm bg-white text-[#005691] rounded-full font-medium hover:bg-gray-100 transition-all duration-300 md:px-8 md:py-4 md:text-base"
            >
              Start Creating
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 md:w-5 md:h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-2.5 text-sm border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-[#005691] transition-all duration-300 md:px-8 md:py-4 md:text-base"
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
                    We're revolutionizing the music and entertainment experience. Through immersive 
                    audio technology, seamless streaming, and intuitive design, we're creating more than 
                    a platform—we're crafting the soundtrack to your life.
                  </p>
                  <p>
                    Every beat, every melody, every moment is designed to connect artists with audiences 
                    in ways never before possible. This is entertainment, reimagined for the digital symphony.
                  </p>
                </div>
                
                {/* Entertainment Features */}
                <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 sm:gap-6 sm:mt-12">
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#add8e6] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium sm:text-sm text-white/70">Hi-Fi Audio</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#0077b6] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium sm:text-sm text-white/70">Live Streaming</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#005691] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium sm:text-sm text-white/70">Smart Playlists</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                  >
                    <div className="w-2 h-2 bg-[#16599c] rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium sm:text-sm text-white/70">Social Discovery</span>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Music Visualization */}
                  <motion.div 
                    className="relative"
                    variants={slideUp}
                  >
                    <div className="aspect-square bg-gradient-to-br from-[#003366]/30 to-[#0077b6]/30 rounded-3xl border border-white/10 backdrop-blur-sm p-6 sm:p-8 md:p-12 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        {/* Central 3D Music Note */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          animate={{
                            rotateX: [0, 360],
                            rotateY: [0, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          style={{
                            perspective: "1000px", // Adds 3D perspective
                          }}
                        >
                          <span className="text-5xl sm:text-6xl md:text-7xl text-[#add8e6] drop-shadow-lg">
                            ♬
                          </span>
                        </motion.div>

                        {/* Rotating Entertainment Icons */}
                        <motion.div 
                          className="absolute inset-0"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        >
                          <Play className="absolute top-2 sm:top-3 md:top-4 left-1/2 -translate-x-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#089fd1]" />
                          <Headphones className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#0899e7]" />
                          <Radio className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#4787b1]" />
                          <Mic className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 text-[#2471be]" />
                        </motion.div>

                        {/* Counter-rotating Volume Icons */}
                        <motion.div 
                          className="absolute inset-8"
                          animate={{ rotate: -360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        >
                          <Volume2 className="absolute top-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#add8e6]/70" />
                          <Volume2 className="absolute right-0 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#089fd1]/70" />
                          <Volume2 className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#0899e7]/70" />
                          <Volume2 className="absolute left-0 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-6 h-4 sm:h-5 md:h-6 text-[#4787b1]/70" />
                        </motion.div>
                        
                        {/* Audio Wave Lines */}
                        <svg className="absolute inset-0 w-full h-full">
                          <defs>
                            <linearGradient id="wave-gradient">
                              <stop offset="0%" stopColor="#add8e6" stopOpacity="0.4"/>
                              <stop offset="100%" stopColor="#0077b6" stopOpacity="0.8"/>
                            </linearGradient>
                          </defs>
                          {/* Animated sound waves */}
                          <motion.circle 
                            cx="50%" 
                            cy="50%" 
                            r="30%" 
                            stroke="url(#wave-gradient)" 
                            strokeWidth="1" 
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          />
                          <motion.circle 
                            cx="50%" 
                            cy="50%" 
                            r="45%" 
                            stroke="url(#wave-gradient)" 
                            strokeWidth="1" 
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          />
                          <motion.circle 
                            cx="50%" 
                            cy="50%" 
                            r="60%" 
                            stroke="url(#wave-gradient)" 
                            strokeWidth="1" 
                            fill="none"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          />
                        </svg>

                        {/* Floating Musical Notes */}
                        <motion.div 
                          className="absolute top-4 right-6 text-[#add8e6]/60"
                          animate={{ y: [-5, 5, -5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                        >
                          ♪
                        </motion.div>
                        <motion.div 
                          className="absolute bottom-6 left-4 text-[#0899e7]/60"
                          animate={{ y: [5, -5, 5] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                        >
                          ♫
                        </motion.div>
                        <motion.div 
                          className="absolute top-8 left-8 text-[#4787b1]/60"
                          animate={{ y: [-3, 7, -3] }}
                          transition={{ duration: 2.8, repeat: Infinity, delay: 0.5 }}
                        >
                          ♩
                        </motion.div>
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