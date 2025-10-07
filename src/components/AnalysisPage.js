import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Brain,
  FileText,
  User,
  Calendar,
  Activity
} from 'lucide-react';
import { useUserPermissions } from './ProtectedRoute';
import apiService from '../services/apiService';

const AnalysisPage = () => {
  const [reports, setReports] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const permissions = useUserPermissions();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.reports.getAllReports();
      const reportsData = response.data.data || response.data || [];
      setReports(reportsData);
      
      // Filter reports that have analysis results
      const analyzedReports = reportsData.filter(report => report.analysisResults);
      setAnalyses(analyzedReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
      setAnalyses([]);
      // Show user-friendly error message
      if (error.response?.status === 404) {
        console.log('Reports endpoint not found - check if backend is running');
      } else if (error.response?.status === 401) {
        console.log('Authentication required - please login again');
      }
    } finally {
      setLoading(false);
    }
  };

  const analyzeReport = async (reportId, userId) => {
    try {
      setAnalyzing(true);
      let response;
      
      if (reportId) {
        response = await apiService.reports.analyzeSpecificReport(reportId);
      } else if (userId) {
        response = await apiService.reports.analyzeLatestReport(userId);
      }
      
      setAnalysisResult(response.data.data || response.data);
      fetchReports(); // Refresh to get updated analysis
    } catch (error) {
      console.error('Error analyzing report:', error);
      alert('Error analyzing report. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredReports = reports.filter(report =>
    report.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.diagnosis && report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAnalyses = analyses.filter(analysis =>
    analysis.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (analysis.diagnosis && analysis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getAnalysisPreview = (analysisData) => {
    if (!analysisData) return 'No analysis available';
    
    try {
      // Handle object format (new analysis results)
      if (typeof analysisData === 'object') {
        if (analysisData.overallAssessment) {
          return analysisData.overallAssessment.length > 200 
            ? analysisData.overallAssessment.substring(0, 200) + '...' 
            : analysisData.overallAssessment;
        } else if (analysisData.analysisText) {
          return analysisData.analysisText.length > 200 
            ? analysisData.analysisText.substring(0, 200) + '...' 
            : analysisData.analysisText;
        } else {
          return 'Analysis completed - click to view details';
        }
      }
      
      // Handle string format (legacy analysis results)
      return analysisData.length > 200 ? analysisData.substring(0, 200) + '...' : analysisData;
    } catch (error) {
      console.error('Error processing analysis data:', error);
      return 'Error displaying analysis - click to view';
    }
  };

  const downloadAnalysis = (report) => {
    let analysisText = 'No analysis available';
    
    if (report.analysisResults) {
      if (typeof report.analysisResults === 'object') {
        // Handle object format
        const analysis = report.analysisResults;
        analysisText = `
Symptoms: ${Array.isArray(analysis.symptoms) ? analysis.symptoms.join(', ') : analysis.symptoms || 'Not specified'}
Severity: ${analysis.severity || 'Not specified'}
Recommendations: ${Array.isArray(analysis.recommendations) ? analysis.recommendations.join('\n- ') : analysis.recommendations || 'None'}
Follow-up: ${analysis.followUp || 'None specified'}
Risk Factors: ${Array.isArray(analysis.riskFactors) ? analysis.riskFactors.join(', ') : analysis.riskFactors || 'None identified'}
Overall Assessment: ${analysis.overallAssessment || 'Not provided'}

${analysis.analysisText ? 'Additional Notes:\n' + analysis.analysisText : ''}
        `;
      } else {
        // Handle string format (legacy)
        analysisText = report.analysisResults;
      }
    }

    const analysisContent = `
Medical Analysis Report
Patient ID: ${report.userId}
Generated: ${new Date().toLocaleString()}
Status: ${report.status}
Priority: ${report.priority}

Diagnosis: ${report.diagnosis || 'Not specified'}
Symptoms: ${(report.symptoms || []).join(', ') || 'Not specified'}

Analysis Results:
${analysisText}
    `;

    const blob = new Blob([analysisContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${report.userId}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderAnalysisData = (analysisData) => {
    if (!analysisData) return 'No analysis available';
    
    try {
      if (typeof analysisData === 'object') {
        return (
          <div className="space-y-4">
            {analysisData.symptoms && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Symptoms Identified:</h5>
                <p className="text-gray-700">
                  {Array.isArray(analysisData.symptoms) 
                    ? analysisData.symptoms.join(', ')
                    : analysisData.symptoms
                  }
                </p>
              </div>
            )}
            
            {analysisData.severity && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Severity Assessment:</h5>
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  analysisData.severity === 'severe' ? 'bg-red-100 text-red-800' :
                  analysisData.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {analysisData.severity}
                </span>
              </div>
            )}
            
            {analysisData.recommendations && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Recommendations:</h5>
                <div className="text-gray-700">
                  {Array.isArray(analysisData.recommendations) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {analysisData.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{analysisData.recommendations}</p>
                  )}
                </div>
              </div>
            )}
            
            {analysisData.followUp && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Follow-up:</h5>
                <p className="text-gray-700">{analysisData.followUp}</p>
              </div>
            )}
            
            {analysisData.riskFactors && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Risk Factors:</h5>
                <p className="text-gray-700">
                  {Array.isArray(analysisData.riskFactors) 
                    ? analysisData.riskFactors.join(', ')
                    : analysisData.riskFactors
                  }
                </p>
              </div>
            )}
            
            {analysisData.overallAssessment && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Overall Assessment:</h5>
                <p className="text-gray-700">{analysisData.overallAssessment}</p>
              </div>
            )}
            
            {analysisData.analysisText && (
              <div>
                <h5 className="font-medium text-gray-900 mb-1">Additional Analysis:</h5>
                <div className="text-gray-700 whitespace-pre-wrap">{analysisData.analysisText}</div>
              </div>
            )}
          </div>
        );
      } else {
        return <div className="whitespace-pre-wrap">{analysisData}</div>;
      }
    } catch (error) {
      console.error('Error rendering analysis data:', error);
      return <div className="text-red-600">Error displaying analysis data</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-[#128C7E]" />
                Medical Analysis
              </h1>
              <p className="text-gray-600 mt-1">AI-powered analysis and insights</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchReports}
                disabled={loading}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports and analyses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports Ready for Analysis */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-6 h-6 text-[#128C7E]" />
              Reports Ready for Analysis
            </h2>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredReports.map((report) => (
                  <div key={report._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium text-gray-900">{report.userId}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.priority || 'medium'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {report.diagnosis || 'No diagnosis specified'}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {report.chatHistory?.length || 0} interactions
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <button
                          onClick={() => analyzeReport(report._id)}
                          disabled={analyzing}
                          className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-3 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-1 disabled:opacity-50"
                        >
                          {analyzing ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          ) : (
                            <Brain className="w-3 h-3" />
                          )}
                          Analyze
                        </button>
                        
                        {report.analysisResults && (
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                          >
                            <FileText className="w-3 h-3" />
                            View
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No reports available for analysis</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Completed Analyses */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-[#128C7E]" />
              Completed Analyses ({filteredAnalyses.length})
            </h2>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAnalyses.map((analysis) => (
                <div key={analysis._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{analysis.userId}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Analyzed
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {getAnalysisPreview(analysis.analysisResults)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(analysis.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => setSelectedReport(analysis)}
                        className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        View
                      </button>
                      
                      <button
                        onClick={() => downloadAnalysis(analysis)}
                        className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAnalyses.length === 0 && (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed analyses yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Result Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">
                  Analysis Results - {selectedReport.userId}
                </h3>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Report Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Patient ID:</span> {selectedReport.userId}</p>
                      <p><span className="font-medium">Status:</span> {selectedReport.status}</p>
                      <p><span className="font-medium">Priority:</span> {selectedReport.priority}</p>
                      <p><span className="font-medium">Diagnosis:</span> {selectedReport.diagnosis || 'Not specified'}</p>
                      <p><span className="font-medium">Symptoms:</span> {(selectedReport.symptoms || []).join(', ') || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Analysis Info</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Created:</span> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                      <p><span className="font-medium">Last Updated:</span> {new Date(selectedReport.updatedAt).toLocaleString()}</p>
                      <p><span className="font-medium">Chat Interactions:</span> {selectedReport.chatHistory?.length || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">AI Analysis Results</h4>
                  <div className="bg-gray-50 rounded-xl p-4 text-sm">
                    {renderAnalysisData(selectedReport.analysisResults)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={() => downloadAnalysis(selectedReport)}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Analysis
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;