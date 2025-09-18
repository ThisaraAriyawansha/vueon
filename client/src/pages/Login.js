import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoImage from '../assets/logo/logo2.png';
import { motion } from 'framer-motion';

// Animation variants (unchanged)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 100, 
      duration: 0.8 
    }
  }
};

const bgCircleVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.1, 0.2, 0.1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex items-center justify-center min-h-screen px-4 py-8 mt-16 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-4xl mt-4 md:mt-8">
        <motion.div 
          variants={itemVariants}
          className="overflow-hidden bg-white shadow-2xl rounded-2xl"
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Side - Logo with Blurred Background */}
            <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] min-h-64 md:min-h-96">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <motion.div 
                  variants={bgCircleVariants}
                  animate="animate"
                  className="absolute w-32 h-32 rounded-full md:w-48 md:h-48 top-1/4 left-1/4 bg-white/10 blur-3xl"
                ></motion.div>
                <motion.div 
                  variants={bgCircleVariants}
                  animate="animate"
                  transition={{ delay: 1 }}
                  className="absolute w-40 h-40 rounded-full md:w-64 md:h-64 bottom-1/3 right-1/4 bg-purple-400/20 blur-3xl"
                ></motion.div>
                <motion.div 
                  variants={bgCircleVariants}
                  animate="animate"
                  transition={{ delay: 2 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full w-28 h-28 md:w-40 md:h-40 top-1/2 left-1/2 bg-blue-400/15 blur-2xl"
                ></motion.div>
              </div>
              
              {/* Blur overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 backdrop-blur-sm bg-black/20"
              ></motion.div>
              
              {/* Logo and Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 py-8 text-center md:px-8 md:py-16">
                <motion.div 
                  variants={logoVariants}
                  className="mb-4 md:mb-6"
                >
                  <motion.img 
                    src={LogoImage} 
                    alt="Vueon Logo" 
                    className="w-16 h-16 mx-auto mb-2 md:w-24 md:h-24 md:mb-4 drop-shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  />
                </motion.div>
                <motion.h1 
                  variants={itemVariants}
                  className="mb-2 text-xl font-light leading-relaxed text-white md:text-3xl drop-shadow-lg"
                >
                  Welcome to Vueon
                </motion.h1>
                <motion.p 
                  variants={itemVariants}
                  className="max-w-xs text-sm font-light leading-relaxed text-white/90 md:text-lg md:max-w-sm drop-shadow-md"
                >
                  Experience the future of digital innovation
                </motion.p>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex items-center justify-center flex-1 px-4 py-8 bg-white md:px-8 md:py-16">
              <div className="w-full max-w-sm space-y-6 md:space-y-8">
                <motion.div 
                  variants={itemVariants}
                  className="text-center"
                >
                  <h2 className="mb-2 text-2xl font-extrabold text-gray-900 md:text-3xl">
                    Sign in
                  </h2>
                  <p className="text-xs text-gray-600 md:text-sm">
                    Or{' '}
                    <Link
                      to="/register"
                      className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
                    >
                      create a new account
                    </Link>
                  </p>
                </motion.div>
                
                <motion.form 
                  variants={itemVariants}
                  className="mt-6 space-y-4 md:mt-8 md:space-y-6" 
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-3 py-2 text-sm text-red-700 border border-red-200 rounded-lg md:text-base md:px-4 md:py-3 bg-red-50"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div className="space-y-3 md:space-y-4">
                    <motion.div variants={itemVariants}>
                      <label htmlFor="email-address" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm">
                        Email address
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none md:text-base md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <label htmlFor="password" className="block mb-1 text-xs font-medium text-gray-700 md:text-sm">
                        Password
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="relative block w-full px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none md:text-base md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 md:py-3"
                    >
                      {loading ? (
                        <span className="flex items-center text-xs md:text-sm">
                          <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin md:w-5 md:h-5 md:mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : (
                        <span className="text-xs md:text-sm">Sign in</span>
                      )}
                    </motion.button>
                  </motion.div>
                </motion.form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;