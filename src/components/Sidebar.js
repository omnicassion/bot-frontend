import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-md text-sm font-medium ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col justify-between">
      <div>
        <Link to="/" className="flex items-center space-x-2 mb-8">
          <span className="text-2xl font-bold">🩺 Medical Bot</span>
        </Link>

        <nav className="flex flex-col space-y-2">
          <Link to="/chat" className={linkClass('/chat')}>
            Chat
          </Link>
          <Link to="/report" className={linkClass('/report')}>
            Reports
          </Link>
          <Link to="/analyze" className={linkClass('/analyze')}>
            Analysis
          </Link>
          <Link to="/machine" className={linkClass('/machine')}>
            Machine Status
          </Link>
        </nav>
      </div>

      <div className="text-xs text-gray-400 text-center">
        © 2025 Medical Bot
      </div>
    </div>
  );
};

export default Sidebar;
