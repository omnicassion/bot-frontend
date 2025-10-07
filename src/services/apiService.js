import axios from 'axios';
import config from '../config/config';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const loginResponse = localStorage.getItem('loginResponse');
    if (loginResponse) {
      const { token } = JSON.parse(loginResponse);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear stored auth data
      localStorage.removeItem('loginResponse');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// API Service object with all endpoints
const apiService = {
  // Authentication APIs
  auth: {
    login: (credentials) => 
      apiClient.post('/auth/login', credentials),
    
    register: (userData) => 
      apiClient.post('/auth/register', userData),
    
    // Profile management
    updateProfile: (profileData) => 
      apiClient.put('/auth/profile', profileData),
    
    changePassword: (passwordData) => 
      apiClient.put('/auth/change-password', passwordData),
  },

  // Generic HTTP methods for flexibility
  get: (endpoint) => apiClient.get(endpoint),
  post: (endpoint, data) => apiClient.post(endpoint, data),
  put: (endpoint, data) => apiClient.put(endpoint, data),
  delete: (endpoint) => apiClient.delete(endpoint),

  // Admin APIs
  admin: {
    getUserData: () => 
      apiClient.get('/adminRoute/userData'),
    
    updateUserRole: (userId, role) => 
      apiClient.put(`/adminRoute/updateRole/${userId}`, { role }),
    
    // User management endpoints
    getAllUsers: () => {
      const loginResponse = localStorage.getItem('loginResponse');
      const currentUserId = loginResponse ? JSON.parse(loginResponse).id : null;
      if (!currentUserId) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return apiClient.post('/admin/users/list', { userId: currentUserId });
    },
    
    createUser: (userData) => {
      const loginResponse = localStorage.getItem('loginResponse');
      const currentUserId = loginResponse ? JSON.parse(loginResponse).id : null;
      if (!currentUserId) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return apiClient.post('/admin/users', { ...userData, userId: currentUserId });
    },
    
    updateUser: (targetUserId, userData) => {
      const loginResponse = localStorage.getItem('loginResponse');
      const currentUserId = loginResponse ? JSON.parse(loginResponse).id : null;
      if (!currentUserId) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return apiClient.put(`/admin/users/${targetUserId}`, { ...userData, userId: currentUserId });
    },
    
    deleteUser: (targetUserId) => {
      const loginResponse = localStorage.getItem('loginResponse');
      const currentUserId = loginResponse ? JSON.parse(loginResponse).id : null;
      if (!currentUserId) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return apiClient.delete(`/admin/users/${targetUserId}?userId=${currentUserId}`);
    },
    
    getUserById: (targetUserId) => {
      const loginResponse = localStorage.getItem('loginResponse');
      const currentUserId = loginResponse ? JSON.parse(loginResponse).id : null;
      if (!currentUserId) {
        return Promise.reject(new Error('User not authenticated'));
      }
      return apiClient.get(`/admin/users/${targetUserId}?userId=${currentUserId}`);
    },
  },

  // Analysis APIs
  analysis: {
    getAnalysis: (userId) => 
      apiClient.get(`/analyze/${userId}`),
  },

  // Report APIs
  reports: {
    // Legacy endpoint
    generateReport: (userId) => 
      apiClient.get(`/generate/${userId}`),
    
    // New comprehensive report endpoints
    getAllReports: () => 
      apiClient.get('/reports'),
    
    getReportsByStatus: (status) => 
      apiClient.get(`/reports?status=${status}`),
    
    getReportsByPriority: (priority) => 
      apiClient.get(`/reports?priority=${priority}`),
    
    getReportsByUserId: (userId) => 
      apiClient.get(`/reports?userId=${userId}`),
    
    getReportById: (reportId) => 
      apiClient.get(`/reports/${reportId}`),
    
    createReport: (reportData) => 
      apiClient.post('/reports', reportData),
    
    updateReport: (reportId, updateData) => 
      apiClient.put(`/reports/${reportId}`, updateData),
    
    deleteReport: (reportId) => 
      apiClient.delete(`/reports/${reportId}`),
    
    addChatToReport: (userId, chatEntry) => 
      apiClient.post(`/reports/${userId}/chat`, chatEntry),
    
    updateReportAnalysis: (reportId, analysisResults) => 
      apiClient.put(`/reports/${reportId}/analysis`, { analysisResults }),
    
    getReportSummary: (reportId) => 
      apiClient.get(`/reports/${reportId}/summary`),
    
    getBulkReportSummaries: (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return apiClient.get(`/reports/summaries/bulk${queryString ? `?${queryString}` : ''}`);
    },
    
    // Analysis endpoints
    analyzeLatestReport: (userId) => 
      apiClient.get(`/reports/analyze/${userId}`),
    
    analyzeSpecificReport: (reportId) => 
      apiClient.get(`/reports/analyze/report/${reportId}`),
  },

  // Machine APIs
  machines: {
    getMachines: () => 
      apiClient.get('/machines/get'),
    
    createMachine: (machineData) => 
      apiClient.post('/machines/create', machineData),
    
    updateMachineStatus: (machineId, status) => 
      apiClient.put(`/machines/${machineId}/status`, { status }),
    
    deleteMachine: (machineId) => 
      apiClient.delete(`/machines/${machineId}`),
  },

  // Chat APIs
  chat: {
    sendMessage: (userId, message, isNewChat = false) => 
      apiClient.post('/chat/message', { 
        userId, 
        message, 
        isNewChat 
      }, {
        timeout: 60000, // 60 seconds timeout for chat messages (AI responses can take longer)
      }),
  },
};

// Utility functions for common operations
export const apiUtils = {
  // Get user ID from localStorage
  getUserId: () => {
    const loginResponse = localStorage.getItem('loginResponse');
    return loginResponse ? JSON.parse(loginResponse)?.id : null;
  },

  // Get user token from localStorage
  getUserToken: () => {
    const loginResponse = localStorage.getItem('loginResponse');
    return loginResponse ? JSON.parse(loginResponse)?.token : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const loginResponse = localStorage.getItem('loginResponse');
    return !!loginResponse && !!JSON.parse(loginResponse)?.token;
  },

  // Handle API errors consistently
  handleApiError: (error, defaultMessage = 'An error occurred') => {
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'The request is taking longer than expected. The AI is processing your message, please wait a moment and try again if needed.';
    }
    
    // Handle network errors
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    // Handle server response errors
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Handle specific status codes
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    if (error.response?.status === 500) {
      return 'Server error. Please try again in a few moments.';
    }
    
    // Handle other axios/generic errors
    if (error.message) {
      return error.message;
    }
    
    return defaultMessage;
  },
};

export default apiService;