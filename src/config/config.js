// Environment configuration for API endpoints
const config = {
  // API Configuration
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://bot.backend.omnicassion.com/api',
  
  // Request timeout in milliseconds
  API_TIMEOUT: process.env.REACT_APP_API_TIMEOUT || 20000,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'production',
  
  // Development settings
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;