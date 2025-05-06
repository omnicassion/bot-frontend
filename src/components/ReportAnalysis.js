import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ReportAnalysis = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
  const userId = loginResponse?.id;

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const { data } = await axios.get(`https://bot-backend-cy89.onrender.com/api/analyze/${userId}`);
        setAnalysis(data.analysis);
      } catch {
        setError('Failed to fetch analysis.');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchAnalysis();
  }, [userId]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg fixed top-0 right-0 md:left-64 left-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📊</span> Report Analysis
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">AI Powered</span>
          </div>
        </div>
      </div>

      {/* Analysis Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analyzing your report...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-red-600">
              <p className="text-center">{error}</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{analysis}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportAnalysis;