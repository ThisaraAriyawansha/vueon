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
    <nav className="text-white shadow-lg bg-primary">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-4">
          <Link to="/" className="text-2xl font-bold text-light">
            Vueon
          </Link>

          <div className="items-center hidden space-x-6 md:flex">
            <Link to="/" className="transition-colors hover:text-highlight">
              Home
            </Link>
            <Link to="/trending" className="transition-colors hover:text-highlight">
              Trending
            </Link>
            
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/upload" 
                  className="px-4 py-2 transition-colors rounded bg-accent hover:bg-highlight"
                >
                  Upload
                </Link>
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <img 
                      src={`http://localhost:5000/${currentUser.avatar}`} 
                      alt={currentUser.username}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{currentUser.username}</span>
                  </button>
                  
                  {isMenuOpen && (
                    <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white rounded shadow-lg text-primary">
                      <Link 
                        to={`/profile/${currentUser.id}`}
                        className="block px-4 py-2 hover:bg-light"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left hover:bg-light"
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
                  className="transition-colors hover:text-highlight"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 transition-colors rounded bg-accent hover:bg-highlight"
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
          <div className="py-4 border-t md:hidden border-secondary">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="transition-colors hover:text-highlight">
                Home
              </Link>
              <Link to="/trending" className="transition-colors hover:text-highlight">
                Trending
              </Link>
              
              {currentUser ? (
                <>
                  <Link to="/upload" className="transition-colors hover:text-highlight">
                    Upload
                  </Link>
                  <Link to={`/profile/${currentUser.id}`} className="transition-colors hover:text-highlight">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-left transition-colors hover:text-highlight">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="transition-colors hover:text-highlight">
                    Login
                  </Link>
                  <Link to="/register" className="transition-colors hover:text-highlight">
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