import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  User,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import { useUserPermissions, useUserRole } from './ProtectedRoute';
import apiService from '../services/apiService';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReports, setSelectedReports] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  
  const permissions = useUserPermissions();
  const userRole = useUserRole();

  useEffect(() => {
    fetchReports();
  }, [statusFilter, priorityFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let response;
      
      if (statusFilter !== 'all' && priorityFilter !== 'all') {
        // Use apiService methods for filtered requests
        response = await apiService.reports.getReportsByStatus(statusFilter);
      } else if (statusFilter !== 'all') {
        response = await apiService.reports.getReportsByStatus(statusFilter);
      } else if (priorityFilter !== 'all') {
        response = await apiService.reports.getReportsByPriority(priorityFilter);
      } else {
        response = await apiService.reports.getAllReports();
      }

      setReports(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]); // Set empty array on error
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

  const handleCreateReport = async (reportData) => {
    try {
      await apiService.reports.createReport(reportData);
      fetchReports();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report. Please try again.');
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const filteredReports = reports.filter(report =>
    report.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.diagnosis && report.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (report.symptoms && report.symptoms.some(symptom => 
      symptom.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  const handleDeleteReport = async (reportId) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await apiService.reports.deleteReport(reportId);
        fetchReports();
      } catch (error) {
        console.error('Error deleting report:', error);
      }
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedReports.length === 0) return;
    
    if (action === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedReports.length} reports?`)) {
        try {
          await Promise.all(
            selectedReports.map(id => apiService.reports.deleteReport(id))
          );
          setSelectedReports([]);
          fetchReports();
        } catch (error) {
          console.error('Error deleting reports:', error);
        }
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'reviewed': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'archived': return <Archive className="w-4 h-4 text-gray-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
                <FileText className="w-8 h-8 text-[#128C7E]" />
                Medical Reports
              </h1>
              <p className="text-gray-600 mt-1">Manage and analyze patient reports</p>
            </div>
            
            {permissions.canCreateReports && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                New Report
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            {/* Bulk Actions */}
            {selectedReports.length > 0 && permissions.canDeleteReports && (
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({selectedReports.length})
              </button>
            )}
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {permissions.canDeleteReports && (
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReports(filteredReports.map(r => r._id));
                            } else {
                              setSelectedReports([]);
                            }
                          }}
                          className="rounded border-gray-300 text-[#128C7E] focus:ring-[#128C7E]"
                        />
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Patient</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Diagnosis</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      {permissions.canDeleteReports && (
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedReports.includes(report._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedReports([...selectedReports, report._id]);
                              } else {
                                setSelectedReports(selectedReports.filter(id => id !== report._id));
                              }
                            }}
                            className="rounded border-gray-300 text-[#128C7E] focus:ring-[#128C7E]"
                          />
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{report.userId}</div>
                            <div className="text-sm text-gray-500">
                              {report.symptoms?.length || 0} symptoms
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(report.status)}
                          <span className="capitalize font-medium text-gray-700">
                            {report.status || 'draft'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(report.priority)}`}>
                          {report.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs truncate text-gray-900">
                          {report.diagnosis || 'No diagnosis'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewReport(report)}
                            className="p-2 text-gray-400 hover:text-[#128C7E] hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {permissions.canDeleteReports && (
                            <button
                              onClick={() => handleDeleteReport(report._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first report'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <CreateReportModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateReport}
        />
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <ViewReportModal
          report={selectedReport}
          onClose={() => {
            setShowViewModal(false);
            setSelectedReport(null);
          }}
        />
      )}
    </div>
  );
};

// Create Report Modal Component
const CreateReportModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    userId: '',
    diagnosis: '',
    symptoms: [],
    status: 'draft',
    priority: 'medium',
    notes: ''
  });
  const [symptomInput, setSymptomInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.userId.trim()) {
      alert('Patient ID is required');
      return;
    }
    onSubmit(formData);
  };

  const addSymptom = () => {
    if (symptomInput.trim() && !formData.symptoms.includes(symptomInput.trim())) {
      setFormData({
        ...formData,
        symptoms: [...formData.symptoms, symptomInput.trim()]
      });
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptom) => {
    setFormData({
      ...formData,
      symptoms: formData.symptoms.filter(s => s !== symptom)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Create New Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
              <input
                type="text"
                required
                value={formData.userId}
                onChange={(e) => setFormData({...formData, userId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="completed">Completed</option>
                <option value="reviewed">Reviewed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis</label>
            <textarea
              value={formData.diagnosis}
              onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              placeholder="Enter diagnosis..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSymptom())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                placeholder="Add symptom..."
              />
              <button
                type="button"
                onClick={addSymptom}
                className="px-4 py-2 bg-[#128C7E] text-white rounded-lg hover:bg-[#075E54] transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Create Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Report Modal Component
const ViewReportModal = ({ report, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Medical Report Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Report Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="text-sm font-medium text-gray-600">Patient ID</label>
              <p className="text-lg font-semibold text-gray-900">{report.userId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(report.status)}`}>
                  {report.status || 'draft'}
                </span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Priority</label>
              <div className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(report.priority)}`}>
                  {report.priority || 'medium'}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnosis */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Diagnosis</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {report.diagnosis || 'No diagnosis provided'}
              </p>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Symptoms</h4>
            <div className="bg-gray-50 rounded-xl p-4">
              {report.symptoms && report.symptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {report.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No symptoms recorded</p>
              )}
            </div>
          </div>

          {/* Notes */}
          {report.notes && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{report.notes}</p>
              </div>
            </div>
          )}

          {/* Chat History */}
          {report.chatHistory && report.chatHistory.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Chat History</h4>
              <div className="bg-gray-50 rounded-xl p-4 max-h-60 overflow-y-auto">
                <div className="space-y-4">
                  {report.chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800">Patient:</p>
                        <p className="text-blue-700">{chat.user}</p>
                      </div>
                      <div className="bg-green-100 rounded-lg p-3">
                        <p className="text-sm font-medium text-green-800">Assistant:</p>
                        <p className="text-green-700">{chat.bot}</p>
                      </div>
                      {chat.timestamp && (
                        <p className="text-xs text-gray-500 text-right">
                          {formatDate(chat.timestamp)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Report Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div>
              <label className="text-sm font-medium text-gray-600">Created</label>
              <p className="text-gray-900">{formatDate(report.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Last Updated</label>
              <p className="text-gray-900">{formatDate(report.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;