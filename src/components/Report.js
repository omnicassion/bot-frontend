import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import html2pdf from 'html2pdf.js';

function Report() {
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(true);

const loginResponse = JSON.parse(localStorage.getItem('loginResponse'));
    // Use the stored user ID
    const userId = loginResponse?.id;
   //sole.log(loginResponse)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`https://bot-backend-cy89.onrender.com/api/generate/${userId}`);
        setReport(res.data.report);
      } catch (err) {
        console.error('Error loading report:', err);
        setReport('Could not generate report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    const opt = {
      margin:       0.5,
      filename:     `radiotherapy_report_${new Date().toISOString()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="report-container">
      <h2>Your Medical Report</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <div id="report-content">
            <ReactMarkdown>{report}</ReactMarkdown>
          </div>
          <button onClick={downloadPDF}>Download PDF</button>
        </>
      )}
    </div>
  );
}

export default Report;
