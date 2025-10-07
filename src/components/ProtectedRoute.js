import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Get user data from localStorage
const getUserData = () => {
  try {
    const loginResponse = localStorage.getItem('loginResponse');
    return loginResponse ? JSON.parse(loginResponse) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const userData = getUserData();
  const location = useLocation();

  // If authentication is required but user is not logged in
  if (requireAuth && !userData) {
    // Redirect to login with the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified and user doesn't have required role
  if (allowedRoles.length > 0 && userData) {
    const userRole = userData.role;
    if (!allowedRoles.includes(userRole)) {
      // Redirect to unauthorized page or home based on role
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If all checks pass, render the component
  return children;
};

// Role-specific route components
export const AdminRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const DoctorRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'doctor']}>
    {children}
  </ProtectedRoute>
);

export const TherapistRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'doctor', 'therapist']}>
    {children}
  </ProtectedRoute>
);

export const MedicalStaffRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'doctor', 'therapist']}>
    {children}
  </ProtectedRoute>
);

export const UserRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={['admin', 'doctor', 'therapist', 'user']}>
    {children}
  </ProtectedRoute>
);

// Hook to get current user role
export const useUserRole = () => {
  const userData = getUserData();
  return userData?.role || null;
};

// Hook to check if user has specific role
export const useHasRole = (role) => {
  const userRole = useUserRole();
  return userRole === role;
};

// Hook to check if user has any of the specified roles
export const useHasAnyRole = (roles) => {
  const userRole = useUserRole();
  return roles.includes(userRole);
};

// Hook to get user permissions
export const useUserPermissions = () => {
  const userRole = useUserRole();
  
  const permissions = {
    canViewReports: ['admin', 'doctor', 'therapist'].includes(userRole),
    canCreateReports: ['admin', 'doctor', 'therapist'].includes(userRole),
    canEditReports: ['admin', 'doctor'].includes(userRole),
    canDeleteReports: ['admin'].includes(userRole),
    canViewAnalysis: ['admin', 'doctor', 'therapist'].includes(userRole),
    canManageUsers: ['admin'].includes(userRole),
    canManageMachines: ['admin', 'doctor'].includes(userRole),
    canViewAdminDashboard: ['admin'].includes(userRole),
    canChat: ['admin', 'doctor', 'therapist', 'user'].includes(userRole),
    canViewOwnReports: true, // All authenticated users can view their own reports
  };

  return permissions;
};

export default ProtectedRoute;