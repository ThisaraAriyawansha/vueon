import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();

  // Routes where the company logo should be visible
  const logoVisibleRoutes = ['/', '/about', '/contact','/trending'];
  const shouldShowLogo = logoVisibleRoutes.includes(location.pathname);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;
      
      // Hide logo when scrolled 30% or more
      setScrolled(scrollPercent >= 10);
    };

    // Set initial values
    handleResize();
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  // Determine if logo should be hidden on desktop
  const shouldHideLogo = isDesktop && (scrolled || !shouldShowLogo);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mt-4 ml-6 mr-6 font-inter">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Company Logo - Hidden on desktop when scrolled 30% or on non-allowed routes */}
          <Link 
            to="/" 
            className={`font-bold text-white font-orbitron transition-all duration-500 ease-in-out
              text-xl sm:text-2xl md:text-2xl
              px-3 py-1.5 sm:px-4 sm:py-2
              rounded-xl sm:rounded-2xl
              bg-primary bg-opacity-30 backdrop-blur-md
              md:bg-transparent md:backdrop-blur-0 md:px-0 md:py-0 md:rounded-none
              ${shouldHideLogo ? 'opacity-0 pointer-events-none transform scale-95' : 'opacity-100 transform scale-100'}`}
          >
            Vueon
          </Link>

          {/* Desktop Menu */}
                <div className={`items-center hidden rounded-l-full rounded-r-full md:flex
                  backdrop-blur-md transition-all duration-500 ease-in-out
                  ${shouldHideLogo 
                    ? 'w-full justify-between px-8 py-2 bg-primary bg-opacity-100' 
                    : 'ml-8 p-2 space-x-6 bg-white bg-opacity-20'
                  }`}
                >
            
            {/* Company Logo Image - positioned on the left when text logo is hidden */}
            <Link to="/" className={`${shouldHideLogo ? 'transform scale-105' : 'ml-auto mr-8'} transition-all duration-500 ease-in-out`}>
              <div className="flex items-center justify-center rounded-full shadow-md">
                <img src="/logo2.png" alt="Vueon Logo" className="object-contain w-8 h-8" />
              </div>
            </Link>

            {/* When logo is hidden, show navigation links on the right */}
            {shouldHideLogo && (
              <div className="flex items-center space-x-6 transition-all duration-500 ease-in-out transform translate-x-0 opacity-100 animate-fade-in">
                <Link to="/" className="text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  Home
                </Link>
                <Link to="/trending" className="text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  Trending
                </Link>
                <Link to="/about" className="text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  About Us
                </Link>
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/upload"
                      className="px-1 py-2 text-sm text-white transition-colors rounded-lg hover:text-gray-300"
                    >
                      Upload
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center space-x-2 text-white"
                      >
                        <img
                          src={`http://localhost:5000/${currentUser.avatar}`}
                          alt={currentUser.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{currentUser.username}</span>
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 z-50 w-48 py-2 mt-2 rounded shadow-lg bg-primary bg-opacity-30 backdrop-blur-md text-primary">
                          <Link
                            to={`/profile/${currentUser.id}`}
                            className="block px-4 py-2 text-sm text-white hover:bg-gray-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-500"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Link
                      to="/login"
                      className="mr-4 text-sm text-white transition-colors hover:text-gray-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm text-white transition-colors rounded-lg hover:text-gray-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* When logo is visible, show navigation links normally */}
            {!shouldHideLogo && (
              <div className="flex items-center space-x-6 transition-all duration-500 ease-in-out">
                <Link to="/" className="ml-8 text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  Home
                </Link>
                <Link to="/trending" className="text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  Trending
                </Link>
                <Link to="/about" className="text-sm text-white transition-colors duration-300 hover:text-gray-300">
                  About Us
                </Link>
                {currentUser ? (
                  <div className="flex items-center space-x-4">
                    <Link
                      to="/upload"
                      className="px-4 py-2 text-sm text-white transition-colors rounded-lg hover:text-gray-300"
                    >
                      Upload
                    </Link>
                    <div className="relative">
                      <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="flex items-center mr-8 space-x-2 text-white"
                      >
                        <img
                          src={`http://localhost:5000/${currentUser.avatar}`}
                          alt={currentUser.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-sm">{currentUser.username}</span>
                      </button>
                      {isMenuOpen && (
                        <div className="absolute right-0 z-50 w-48 py-2 mt-2 rounded shadow-lg bg-primary bg-opacity-30 backdrop-blur-md text-primary">
                          <Link
                            to={`/profile/${currentUser.id}`}
                            className="block px-4 py-2 text-sm text-white hover:bg-gray-500"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-sm text-left text-white hover:bg-gray-500"
                          >
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Link
                      to="/login"
                      className="mr-4 text-sm text-white transition-colors hover:text-gray-300"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 mr-6 text-sm text-white transition-colors rounded-lg hover:text-gray-300"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="p-2 md:hidden rounded-2xl bg-primary bg-opacity-30 backdrop-blur-md">
            <button
              className="text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="p-4 py-4 -mt-4 border-t md:hidden border-secondary bg-primary bg-opacity-30 backdrop-blur-md rounded-b-2xl">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-sm text-white transition-colors hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/trending"
                className="text-sm text-white transition-colors hover:text-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Trending
              </Link>
              {currentUser ? (
                <>
                  <Link
                    to="/upload"
                    className="text-sm text-white transition-colors hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link
                    to={`/profile/${currentUser.id}`}
                    className="text-sm text-white transition-colors hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-left text-white transition-colors hover:text-gray-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-white transition-colors hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm text-white transition-colors hover:text-gray-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;