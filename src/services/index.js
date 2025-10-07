// Export all services and utilities
export { default as apiService, apiUtils } from './apiService';

// Re-export for convenience
import apiService, { apiUtils } from './apiService';
export default apiService;