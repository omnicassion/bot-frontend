import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

function Report() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);
  const loginResponse = JSON.parse(localStorage.getItem('loginResponse')); 
  const userId = loginResponse?.id;

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await axios.get(`https://bot-backend-cy89.onrender.com/api/generate/${userId}`);
        setReport(data.report);
      } catch {
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg fixed top-0 right-0 md:left-64 left-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📋</span> Medical Report
          </h1>
          <button
            onClick={downloadPDF}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Generating your report...</p>
            </div>
          ) : (
            <div id="report-content" className="bg-white rounded-2xl shadow-lg p-8 animate-fadeIn">
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{report}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Report;
