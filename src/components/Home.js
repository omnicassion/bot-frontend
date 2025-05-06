import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Welcome to Medical Assistant</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Chat Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-xl font-semibold mb-2">AI Chat Assistant</h2>
            <p className="text-gray-600 mb-4">
              Get instant answers to your medical queries with our AI-powered chat assistant.
            </p>
            <Link
              to="/chat"
              className="inline-block bg-[#128C7E] text-white px-6 py-2 rounded-lg hover:bg-[#075E54] transition-all duration-200"
            >
              Start Chat
            </Link>
          </div>

          {/* Report Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">Generate Reports</h2>
            <p className="text-gray-600 mb-4">
              Create detailed medical reports and get AI-powered analysis.
            </p>
            <Link
              to="/report"
              className="inline-block bg-[#128C7E] text-white px-6 py-2 rounded-lg hover:bg-[#075E54] transition-all duration-200"
            >
              Create Report
            </Link>
          </div>

          {/* Machine Status Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-xl font-semibold mb-2">Machine Status</h2>
            <p className="text-gray-600 mb-4">
              Monitor and manage the status of medical equipment in real-time.
            </p>
            <Link
              to="/machine"
              className="inline-block bg-[#128C7E] text-white px-6 py-2 rounded-lg hover:bg-[#075E54] transition-all duration-200"
            >
              View Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
