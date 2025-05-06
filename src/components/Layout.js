import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('loginResponse');
    if (data) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem('loginResponse');
      setIsLoggedIn(false);
      setUserData(null);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Navbar */}
        <nav className="bg-gradient-to-r from-[#128C7E] to-[#075E54] px-6 py-4 flex justify-between items-center shadow-lg">
          <h1 className="text-xl font-semibold text-white"></h1>
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <div className="flex items-center gap-2 text-white">
                <span className="text-sm font-medium">{userData?.username}</span>
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  {userData?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={handleAuthClick}
              className="bg-white hover:bg-gray-100 text-[#128C7E] px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
