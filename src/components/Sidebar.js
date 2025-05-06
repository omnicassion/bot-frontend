import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (path) =>
    `px-4 py-2 rounded-md text-sm font-medium block ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      {/* Hamburger Toggle Button - Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-gray-800 bg-white p-2 rounded shadow"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-4 z-40 flex flex-col justify-between transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex`}
      >
        <div>
          {/* X Button inside Sidebar for Mobile */}
          <div className="flex justify-between items-center mb-8 md:hidden">
            <span className="text-2xl font-bold">🩺 Medical Bot</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-800">
              <X size={24} />
            </button>
          </div>

          {/* For Desktop, just show title */}
          <div className="hidden md:block mb-8">
            <span className="text-2xl font-bold">🩺 Medical Bot</span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            <Link to="/chat" className={linkClass('/chat')} onClick={() => setIsOpen(false)}>
              Chat
            </Link>
            <Link to="/report" className={linkClass('/report')} onClick={() => setIsOpen(false)}>
              Reports
            </Link>
            <Link to="/analyze" className={linkClass('/analyze')} onClick={() => setIsOpen(false)}>
              Analysis
            </Link>
            <Link to="/machine" className={linkClass('/machine')} onClick={() => setIsOpen(false)}>
              Machine Status
            </Link>
            <Link to="/AdminDashboard" className={linkClass('/AdminDashboard')} onClick={() => setIsOpen(false)}>
  Admin Dashboard
</Link>

          </nav>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4">
          © 2025 Medical Bot
        </div>
      </div>

      {/* Backdrop when sidebar is open (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
