import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoImage from '../assets/logo/logo2.png';
import { motion } from 'framer-motion';

// Refined animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      const result = await register(username, email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex items-center justify-center min-h-screen px-4 py-12 bg-white sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-4xl mt-24">
        <motion.div 
          variants={scaleIn}
          className="overflow-hidden bg-white shadow-2xl rounded-2xl"
        >
          <div className="flex">
            {/* Left Side - Logo with Blurred Background */}
            <div className="relative flex-1 overflow-hidden bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] min-h-96">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                  className="absolute w-48 h-48 rounded-full top-1/4 left-1/4 bg-white/10 blur-3xl"
                ></motion.div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                  className="absolute w-64 h-64 rounded-full bottom-1/3 right-1/4 bg-purple-400/20 blur-3xl"
                ></motion.div>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.15 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="absolute w-40 h-40 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-blue-400/15 blur-2xl"
                ></motion.div>
              </div>
              
              {/* Blur overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 backdrop-blur-sm bg-black/20"
              ></motion.div>
              
              {/* Logo and Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 py-16 text-center">
                <motion.div 
                  variants={fadeInUp}
                  className="mb-6"
                >
                  <motion.img 
                    src={LogoImage} 
                    alt="Vueon Logo" 
                    className="w-24 h-24 mx-auto mb-4 drop-shadow-2xl"
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.3 } 
                    }}
                  />
                </motion.div>
                <motion.h1 
                  variants={fadeInUp}
                  className="mb-4 text-3xl font-light leading-relaxed text-white drop-shadow-lg"
                >
                  Join Vueon
                </motion.h1>
                <motion.p 
                  variants={fadeInUp}
                  className="max-w-sm text-lg font-light leading-relaxed text-white/90 drop-shadow-md"
                >
                  Start your journey with innovative digital solutions
                </motion.p>
              </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="flex items-center justify-center flex-1 px-8 py-16 bg-white">
              <div className="w-full max-w-sm space-y-8">
                <motion.div 
                  variants={fadeInUp}
                  className="text-center"
                >
                  <h2 className="mb-2 text-3xl font-extrabold text-gray-900">
                    Create account
                  </h2>
                  <p className="text-sm text-gray-600">
                    Or{' '}
                    <Link
                      to="/login"
                      className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
                    >
                      sign in to existing account
                    </Link>
                  </p>
                </motion.div>
                
                <motion.form 
                  variants={fadeIn}
                  className="mt-8 space-y-6" 
                  onSubmit={handleSubmit}
                >
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div className="space-y-4">
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="username" className="block mb-1 text-sm font-medium text-gray-700">
                        Username
                      </label>
                      <motion.input
                        whileFocus={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label htmlFor="email-address" className="block mb-1 text-sm font-medium text-gray-700">
                        Email address
                      </label>
                      <motion.input
                        whileFocus={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </motion.div>
                    
                    <motion.div variants={fadeInUp}>
                      <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <motion.input
                        whileFocus={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </motion.div>

                    <motion.div variants={fadeInUp}>
                      <label htmlFor="confirm-password" className="block mb-1 text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <motion.input
                        whileFocus={{ 
                          scale: 1.01,
                          transition: { duration: 0.2 }
                        }}
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="relative block w-full px-3 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={fadeInUp}>
                    <motion.button
                      whileHover={{ 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      disabled={loading}
                      className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-br from-[#192f4a] via-[#003366] to-[#005691] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        'Create account'
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

export default Register;