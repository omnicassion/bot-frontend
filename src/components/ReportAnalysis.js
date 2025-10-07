import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import apiService, { apiUtils } from '../services/apiService';

const ReportAnalysis = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = apiUtils.getUserId();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await apiService.analysis.getAnalysis(userId);
        setAnalysis(data.analysis);
      } catch (error) {
        setError(apiUtils.handleApiError(error, 'Failed to fetch analysis.'));
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchAnalysis();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('loginResponse');
    // Redirect to login page
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg fixed top-0 right-0 md:left-64 left-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white hover:text-gray-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            <h1 className="text-xl font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analysis
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">AI Powered</span>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 transition-colors flex items-center gap-2"
            >
              <span>Logout</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
              <div className="w-12 h-12 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Analyzing your report...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-600">
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                  li: ({ children }) => <li className="mb-2">{children}</li>,
                  code: ({ children }) => (
                    <code className="bg-gray-100 rounded px-2 py-1">{children}</code>
                  ),
                  pre: ({ children }) => (
                    <pre className="bg-gray-100 rounded p-4 overflow-x-auto mb-4">
                      {children}
                    </pre>
                  ),
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;