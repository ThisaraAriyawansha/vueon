import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-light">
            Vueon
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-highlight transition-colors">
              Home
            </Link>
            <Link to="/trending" className="hover:text-highlight transition-colors">
              Trending
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/upload" 
                  className="bg-accent hover:bg-highlight px-4 py-2 rounded transition-colors"
                >
                  Upload
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <img 
                      src={currentUser.avatar || '/default-avatar.png'} 
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{currentUser.username}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-primary rounded shadow-lg py-2 z-50">
                      <Link 
                        to={`/profile/${currentUser.id}`}
                        className="block px-4 py-2 hover:bg-light"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-light"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="hover:text-highlight transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent hover:bg-highlight px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-highlight transition-colors">
                Home
              </Link>
              <Link to="/trending" className="hover:text-highlight transition-colors">
                Trending
              </Link>
              
              {currentUser ? (
                <>
                  <Link to="/upload" className="hover:text-highlight transition-colors">
                    Upload
                  </Link>
                  <Link to={`/profile/${currentUser.id}`} className="hover:text-highlight transition-colors">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left hover:text-highlight transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-highlight transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-highlight transition-colors">
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