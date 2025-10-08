import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Save,
  Send
} from 'lucide-react';
import { useUserRole } from './ProtectedRoute';
import apiService from '../services/apiService';

const PIQFormPage = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState(null);
  const [editMode, setEditMode] = useState(false);
  
  const userRole = useUserRole();
  const username = localStorage.getItem('username') || '';

  useEffect(() => {
    fetchForms();
  }, [statusFilter]);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await apiService.piqForms.getAllForms(params);
      setForms(response.data.data || []);
    } catch (error) {
      console.error('Error fetching PIQ forms:', error);
      setForms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredForms = forms.filter(form =>
    form.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (form.diagnosis && form.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateForm = () => {
    setSelectedForm(null);
    setEditMode(true);
    setShowCreateModal(true);
  };

  const handleViewForm = (form) => {
    setSelectedForm(form);
    setEditMode(false);
    setShowViewModal(true);
  };

  const handleEditForm = (form) => {
    setSelectedForm(form);
    setEditMode(true);
    setShowCreateModal(true);
  };

  const handleDeleteForm = async (formId) => {
    if (window.confirm('Are you sure you want to delete this PIQ form?')) {
      try {
        await apiService.piqForms.deleteForm(formId);
        fetchForms();
      } catch (error) {
        console.error('Error deleting form:', error);
        alert('Failed to delete form');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'reviewed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'archived':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'draft':
        return <Clock className="w-4 h-4" />;
      case 'submitted':
        return <Send className="w-4 h-4" />;
      case 'reviewed':
        return <CheckCircle className="w-4 h-4" />;
      case 'archived':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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
                PIQ Forms Management
              </h1>
              <p className="text-gray-600 mt-1">Patient Information Questionnaire</p>
            </div>
            
            {(userRole === 'therapist' || userRole === 'doctor' || userRole === 'admin') && (
              <button
                onClick={handleCreateForm}
                className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create New PIQ Form
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name, ID, or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="reviewed">Reviewed</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No PIQ forms found</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first PIQ form to get started'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Diagnosis
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Treatment Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Therapist
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredForms.map((form) => (
                    <tr key={form._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">{form.patientName}</div>
                            <div className="text-sm text-gray-500">{form.patientId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{form.diagnosis || 'N/A'}</div>
                        {form.staging && (
                          <div className="text-xs text-gray-500">{form.staging}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{form.treatmentType || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {form.therapist?.username || form.therapistId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(form.status)}`}>
                          {getStatusIcon(form.status)}
                          {form.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(form.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewForm(form)}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                            title="View"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          
                          {(userRole === 'therapist' || userRole === 'doctor' || userRole === 'admin') && (
                            <button
                              onClick={() => handleEditForm(form)}
                              className="text-green-600 hover:text-green-800 transition-colors p-2 hover:bg-green-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                          )}
                          
                          {(userRole === 'doctor' || userRole === 'admin') && (
                            <button
                              onClick={() => handleDeleteForm(form._id)}
                              className="text-red-600 hover:text-red-800 transition-colors p-2 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <PIQFormModal
          form={selectedForm}
          isEdit={!!selectedForm}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedForm(null);
            setEditMode(false);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setSelectedForm(null);
            setEditMode(false);
            fetchForms();
          }}
          therapistId={username}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedForm && (
        <PIQFormViewModal
          form={selectedForm}
          onClose={() => {
            setShowViewModal(false);
            setSelectedForm(null);
          }}
          onEdit={() => {
            setShowViewModal(false);
            handleEditForm(selectedForm);
          }}
        />
      )}
    </div>
  );
};

// PIQ Form Modal Component
const PIQFormModal = ({ form, isEdit, onClose, onSuccess, therapistId }) => {
  const [formData, setFormData] = useState({
    patientId: form?.patientId || '',
    patientName: form?.patientName || '',
    age: form?.age || '',
    gender: form?.gender || '',
    contactNumber: form?.contactNumber || '',
    diagnosis: form?.diagnosis || '',
    grading: form?.grading || '',
    staging: form?.staging || '',
    incomeStatus: form?.incomeStatus || '',
    performanceStatus: form?.performanceStatus || '',
    description: form?.description || '',
    clinicalNotes: form?.clinicalNotes || '',
    treatment: form?.treatment || '',
    dosage: form?.dosage || '',
    treatmentType: form?.treatmentType || '',
    treatmentStartDate: form?.treatmentStartDate ? form.treatmentStartDate.split('T')[0] : '',
    numberOfSessions: form?.numberOfSessions || '',
    status: form?.status || 'draft',
    priority: form?.priority || 'medium',
    therapistId: form?.therapistId || therapistId
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, submitStatus = 'draft') => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit = { ...formData, status: submitStatus };
      
      if (isEdit) {
        await apiService.piqForms.updateForm(form._id, dataToSubmit);
      } else {
        await apiService.piqForms.createForm(dataToSubmit);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving form:', error);
      alert('Failed to save form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Edit PIQ Form' : 'Create New PIQ Form'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'draft')} className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Patient Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter patient ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter contact number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Income Status</label>
                <select
                  name="incomeStatus"
                  value={formData.incomeStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Income Status</option>
                  <option value="Below Poverty Line">Below Poverty Line</option>
                  <option value="Lower Income">Lower Income</option>
                  <option value="Middle Income">Middle Income</option>
                  <option value="Upper Income">Upper Income</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Diagnosis <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter diagnosis details"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grading</label>
                <select
                  name="grading"
                  value={formData.grading}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Grade</option>
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staging</label>
                <select
                  name="staging"
                  value={formData.staging}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Stage</option>
                  <option value="Stage 0">Stage 0</option>
                  <option value="Stage I">Stage I</option>
                  <option value="Stage II">Stage II</option>
                  <option value="Stage III">Stage III</option>
                  <option value="Stage IV">Stage IV</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Performance Status</label>
                <select
                  name="performanceStatus"
                  value={formData.performanceStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Performance Status</option>
                  <option value="ECOG 0 - Fully active">ECOG 0 - Fully active</option>
                  <option value="ECOG 1 - Restricted in physically strenuous activity">ECOG 1 - Restricted in physically strenuous activity</option>
                  <option value="ECOG 2 - Ambulatory and capable of self-care">ECOG 2 - Ambulatory and capable of self-care</option>
                  <option value="ECOG 3 - Capable of limited self-care">ECOG 3 - Capable of limited self-care</option>
                  <option value="ECOG 4 - Completely disabled">ECOG 4 - Completely disabled</option>
                  <option value="Not Assessed">Not Assessed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Treatment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Type</label>
                <select
                  name="treatmentType"
                  value={formData.treatmentType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="">Select Treatment Type</option>
                  <option value="Chemotherapy">Chemotherapy</option>
                  <option value="Radiotherapy">Radiotherapy</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Immunotherapy">Immunotherapy</option>
                  <option value="Hormone Therapy">Hormone Therapy</option>
                  <option value="Targeted Therapy">Targeted Therapy</option>
                  <option value="Palliative Care">Palliative Care</option>
                  <option value="Combination Therapy">Combination Therapy</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Start Date</label>
                <input
                  type="date"
                  name="treatmentStartDate"
                  value={formData.treatmentStartDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sessions</label>
                <input
                  type="number"
                  name="numberOfSessions"
                  value={formData.numberOfSessions}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Total sessions planned"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
                <input
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter dosage information"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Details</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter detailed treatment information"
                />
              </div>
            </div>
          </div>

          {/* Description and Clinical Notes */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter general description or notes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinical Notes</label>
                <textarea
                  name="clinicalNotes"
                  value={formData.clinicalNotes}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                  placeholder="Enter clinical observations and notes"
                />
              </div>
            </div>
          </div>

          {/* Priority and Status */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Form Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={saving}
            className="px-6 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'submitted')}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Submit Form
          </button>
        </div>
      </div>
    </div>
  );
};

// PIQ Form View Modal Component
const PIQFormViewModal = ({ form, onClose, onEdit }) => {
  const userRole = useUserRole();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">PIQ Form Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Patient Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Patient Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Patient Name</p>
                <p className="text-base text-gray-900">{form.patientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Patient ID</p>
                <p className="text-base text-gray-900">{form.patientId}</p>
              </div>
              {form.age && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Age</p>
                  <p className="text-base text-gray-900">{form.age} years</p>
                </div>
              )}
              {form.gender && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-base text-gray-900">{form.gender}</p>
                </div>
              )}
              {form.contactNumber && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Contact</p>
                  <p className="text-base text-gray-900">{form.contactNumber}</p>
                </div>
              )}
              {form.incomeStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Income Status</p>
                  <p className="text-base text-gray-900">{form.incomeStatus}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medical Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Medical Information
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Diagnosis</p>
                <p className="text-base text-gray-900">{form.diagnosis}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {form.grading && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Grading</p>
                    <p className="text-base text-gray-900">{form.grading}</p>
                  </div>
                )}
                {form.staging && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Staging</p>
                    <p className="text-base text-gray-900">{form.staging}</p>
                  </div>
                )}
              </div>
              {form.performanceStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Performance Status</p>
                  <p className="text-base text-gray-900">{form.performanceStatus}</p>
                </div>
              )}
            </div>
          </div>

          {/* Treatment Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Treatment Information
            </h4>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                {form.treatmentType && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Treatment Type</p>
                    <p className="text-base text-gray-900">{form.treatmentType}</p>
                  </div>
                )}
                {form.dosage && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Dosage</p>
                    <p className="text-base text-gray-900">{form.dosage}</p>
                  </div>
                )}
                {form.numberOfSessions && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Sessions</p>
                    <p className="text-base text-gray-900">
                      {form.sessionsCompleted || 0} / {form.numberOfSessions}
                    </p>
                  </div>
                )}
                {form.treatmentStartDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="text-base text-gray-900">
                      {new Date(form.treatmentStartDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              {form.treatment && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Treatment Details</p>
                  <p className="text-base text-gray-900 whitespace-pre-wrap">{form.treatment}</p>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {(form.description || form.clinicalNotes) && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                Notes
              </h4>
              <div className="space-y-3">
                {form.description && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-base text-gray-900 whitespace-pre-wrap">{form.description}</p>
                  </div>
                )}
                {form.clinicalNotes && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Clinical Notes</p>
                    <p className="text-base text-gray-900 whitespace-pre-wrap">{form.clinicalNotes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form Metadata */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              Form Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Therapist</p>
                <p className="text-base text-gray-900">
                  {form.therapist?.username || form.therapistId}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-base text-gray-900">{form.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <p className="text-base text-gray-900 capitalize">{form.priority}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-base text-gray-900">
                  {new Date(form.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {(userRole === 'therapist' || userRole === 'doctor' || userRole === 'admin') && (
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Form
            </button>
          )}
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PIQFormPage;
