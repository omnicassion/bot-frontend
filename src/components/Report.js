import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';
import { Link } from 'react-router-dom';
import apiService, { apiUtils } from '../services/apiService';

function Report() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = apiUtils.getUserId();

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await apiService.reports.generateReport(userId);
        setReport(data.report);
      } catch (error) {
        console.error('Error generating report:', error);
        setReport('Could not generate report. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [userId]);

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: `radiotherapy_report_${new Date().toISOString()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .save();
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  const handleDownload = () => {
    downloadPDF();
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Report
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

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-24">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)]">
              <div className="w-12 h-12 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600">Generating your report...</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
                {report}
              </ReactMarkdown>
              <button
                onClick={handleDownload}
                className="mt-6 bg-[#128C7E] text-white px-6 py-2 rounded-lg shadow hover:bg-[#075E54] transition-all duration-200"
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
