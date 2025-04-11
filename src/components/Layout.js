import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('loginResponse');
    setIsLoggedIn(!!userData);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout
      localStorage.removeItem('loginResponse');
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      // Login
      navigate('/login');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white px-6 py-3 flex justify-between items-center shadow-sm">
          <h1 className="text-xl font-semibold text-gray-700"></h1>
          <button
            onClick={handleAuthClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
