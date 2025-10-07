# API Service Documentation

This document describes the centralized API service created for the bot-frontend application.

## Overview

The API service provides a centralized way to handle all HTTP requests in the application using axios. It includes:

- Centralized configuration
- Request/response interceptors
- Error handling
- Authentication token management
- Utility functions

## Files Structure

```
src/
├── services/
│   ├── apiService.js    # Main API service
│   └── index.js         # Service exports
├── config/
│   └── config.js        # Environment configuration
```

## Features

### 1. Centralized Configuration
- Base URL configuration from environment variables
- Timeout settings
- Default headers

### 2. Authentication
- Automatic token injection from localStorage
- Automatic redirect on 401 errors
- Token validation utilities

### 3. Error Handling
- Centralized error processing
- User-friendly error messages
- Specific handling for different error types

### 4. Available Endpoints

#### Authentication
- `apiService.auth.login(credentials)` - User login
- `apiService.auth.register(userData)` - User registration

#### Admin Operations
- `apiService.admin.getUserData()` - Get all users
- `apiService.admin.updateUserRole(userId, role)` - Update user role

#### Analysis & Reports
- `apiService.analysis.getAnalysis(userId)` - Get user analysis
- `apiService.reports.generateReport(userId)` - Generate user report

#### Machine Management
- `apiService.machines.getMachines()` - Get all machines
- `apiService.machines.createMachine(machineData)` - Create new machine
- `apiService.machines.updateMachineStatus(machineId, status)` - Update machine status
- `apiService.machines.deleteMachine(machineId)` - Delete machine

#### Chat
- `apiService.chat.sendMessage(userId, message, isNewChat)` - Send chat message

## Utility Functions

### apiUtils
- `getUserId()` - Get current user ID from localStorage
- `getUserToken()` - Get current user token from localStorage
- `isAuthenticated()` - Check if user is authenticated
- `handleApiError(error, defaultMessage)` - Process API errors consistently

## Usage Examples

### Basic API Call
```javascript
import apiService from '../services/apiService';

// Login user
try {
  const response = await apiService.auth.login({ username, password });
  console.log('Login successful:', response.data);
} catch (error) {
  console.error('Login failed:', error);
}
```

### Using Utilities
```javascript
import { apiUtils } from '../services/apiService';

// Check authentication
if (!apiUtils.isAuthenticated()) {
  // Redirect to login
}

// Get user ID
const userId = apiUtils.getUserId();

// Handle errors
catch (error) {
  const errorMessage = apiUtils.handleApiError(error, 'Operation failed');
  setError(errorMessage);
}
```

### Environment Configuration
Create a `.env` file in your project root:

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
REACT_APP_API_TIMEOUT=10000
```

## Migration from Old Code

The following components have been updated to use the new API service:

1. **Login.js** - Auth endpoints
2. **UserTable.js** - Admin endpoints  
3. **ReportAnalysis.js** - Analysis endpoints
4. **Report.js** - Report endpoints
5. **MachineStatus.js** - Machine management endpoints
6. **MachineStatusViewOnly.js** - Machine read endpoints
7. **Chat.js** - Chat endpoints

## Benefits

1. **Consistency** - All API calls follow the same pattern
2. **Maintainability** - Easy to update base URL or add new interceptors
3. **Error Handling** - Centralized and consistent error processing
4. **Security** - Automatic token management and validation
5. **Performance** - Request/response interceptors for optimization
6. **Development** - Better debugging and logging capabilities

## Future Enhancements

- Request caching
- Retry logic for failed requests
- Request/response logging in development
- API response validation with schemas
- Request cancellation support
- Offline support with service workers