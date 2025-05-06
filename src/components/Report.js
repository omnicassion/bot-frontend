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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8 transform transition-transform duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center animate-fadeIn">
          Your Medical Report
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <p className="text-lg text-gray-600 animate-pulse">Loading report...</p>
          </div>
        ) : (
          <>
            <div id="report-content" className="prose prose-lg prose-indigo max-w-none mb-8">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
            <div className="text-right">
              <button
                onClick={downloadPDF}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-shadow"
              >
                Download PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Report;
