import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, Settings, ChevronDown, LogOut, User, Wifi, WifiOff } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const data = localStorage.getItem('loginResponse');
        if (data) {
          setIsLoggedIn(true);
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeApp();

    // Close user menu when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    // Online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    document.addEventListener('click', handleClickOutside);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Close user menu when route changes
  useEffect(() => {
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('loginResponse');
    setIsLoggedIn(false);
    setUserData(null);
    setShowUserMenu(false);
    navigate('/login');
  };

  const handleLogin = () => {
    navigate('/login');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white px-4 py-2 text-center text-sm z-50">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4" />
            You are currently offline. Some features may not be available.
          </div>
        </div>
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative md:ml-0">
        {/* Enhanced Navbar */}
        <nav className={`bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm sticky z-10 transition-all duration-200 ${!isOnline ? 'top-10' : 'top-0'}`}>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800 hidden md:block">
              Medical Assistant Dashboard
            </h1>
            <div className="flex items-center gap-2 md:hidden">
              <div className="w-8 h-8 bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-lg font-semibold text-gray-800">Medical Bot</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Online Status & Notifications */}
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <Wifi className="w-4 h-4 text-green-500" title="Online" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" title="Offline" />
                  )}
                  
                  <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  </button>
                </div>

                {/* Settings */}
                <button 
                  onClick={() => navigate('/settings')}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-r from-[#128C7E] to-[#075E54] rounded-full flex items-center justify-center text-white font-semibold">
                        {userData?.username?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-900">{userData?.username}</p>
                        <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-0.5 ${getRoleColor(userData?.role)}`}>
                          {userData?.role}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{userData?.username}</p>
                        <p className="text-xs text-gray-500">{userData?.email || 'No email set'}</p>
                        <span className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${getRoleColor(userData?.role)}`}>
                          {userData?.role}
                        </span>
                      </div>
                      
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Profile Settings
                        </button>
                        
                        <hr className="my-1 border-gray-100" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-[#128C7E] to-[#075E54] hover:shadow-lg text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Login
              </button>
            )}
          </div>
        </nav>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
