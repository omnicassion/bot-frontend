import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const data = localStorage.getItem('loginResponse');
      if (data) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(data));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    checkAuth();
    // Listen for storage changes (in case login happens in another tab)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loginResponse');
    setIsLoggedIn(false);
    setUserData(null);
    navigate('/');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'doctor': return 'bg-blue-100 text-blue-800';
      case 'therapist': return 'bg-green-100 text-green-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold hover:text-green-100 transition-colors">
              🩺 Medical Assistant
            </Link>
          </div>

          {/* Navigation Links - Only show on public pages */}
          {!isLoggedIn && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' ? '' : ''
                }`}
              >
                Home
              </Link>
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold">
                    {userData?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{userData?.username}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(userData?.role)}`}>
                      {userData?.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className=" bg-opacity-20  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-opacity-20  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-white hover:text-green-100 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
