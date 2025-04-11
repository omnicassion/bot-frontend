import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ReportAnalysis = () => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
    const userId = loginResponse?.id;

  const fetchAnalysis = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/analyze/${userId}`);
      setAnalysis(response.data.analysis);
    } catch (err) {
      setError('Failed to fetch analysis.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchAnalysis();
  }, [userId]);

  return (
    <div className="min-h-screen bg-white px-4 py-6 sm:px-10">
      <div className="max-w-4xl mx-auto shadow-xl rounded-2xl p-6 border border-gray-200 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🧠 AI Medical Report Analysis</h2>
        {loading && <p className="text-gray-500">Analyzing report...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="prose max-w-none bg-white p-4 rounded-lg border border-gray-300">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAnalysis;
