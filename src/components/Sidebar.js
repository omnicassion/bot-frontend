import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, FileText, BarChart2, Activity, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { path: '/chat', label: 'Chat', icon: <MessageSquare size={20} /> },
    { path: '/report', label: 'Reports', icon: <FileText size={20} /> },
    { path: '/analyze', label: 'Analysis', icon: <BarChart2 size={20} /> },
    { path: '/machine', label: 'Machine Status', icon: <Activity size={20} /> },
    { path: '/AdminDashboard', label: 'Admin Dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  const linkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? 'bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <>
      {/* Hamburger Toggle Button - Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="text-[#128C7E] bg-white p-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl p-6 z-40 flex flex-col justify-between transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static md:flex`}
      >
        <div>
          {/* X Button inside Sidebar for Mobile */}
          <div className="flex justify-between items-center mb-8 md:hidden">
            <span className="text-2xl font-bold text-[#128C7E] flex items-center gap-2">
              <span className="text-3xl">🩺</span> Medical Bot
            </span>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            >
              <X size={24} />
            </button>
          </div>

          {/* For Desktop, just show title */}
          <div className="hidden md:block mb-8">
            <span className="text-2xl font-bold text-[#128C7E] flex items-center gap-2">
              <span className="text-3xl">🩺</span> Medical Bot
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={linkClass(item.path)}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="text-xs text-gray-400 text-center mt-4 border-t border-gray-100 pt-4">
          <p className="font-medium text-gray-500 mb-1">Medical Assistant v1.0</p>
          <p>© 2025 Medical Bot. All rights reserved.</p>
        </div>
      </div>

      {/* Backdrop when sidebar is open (mobile only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
