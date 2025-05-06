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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-10">
      <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-8 animate-slideUp">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 flex items-center">
          <span className="mr-2 animate-pulse">🧠</span> AI Medical Report Analysis
        </h2>

        {loading && (
          <p className="text-gray-500 animate-pulse">Analyzing report...</p>
        )}
        {error && (
          <p className="text-red-500">{error}</p>
        )}
        {!loading && !error && (
          <div className="prose prose-lg bg-white p-6 rounded-xl border border-gray-200 shadow-sm transform transition-shadow hover:shadow-lg">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalysis;