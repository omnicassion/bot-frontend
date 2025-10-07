import React from 'react';
import { Link } from 'react-router-dom';
import { useUserRole } from './ProtectedRoute';

const Unauthorized = () => {
  const userRole = useUserRole();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 5c-.77-.833-1.728-.833-2.498 0L4.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          {userRole && (
            <p className="text-sm text-gray-500 mb-6">
              Your current role: <span className="font-semibold text-red-600 capitalize">{userRole}</span>
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Link
            to="/chat"
            className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-200 block"
          >
            Go to Chat
          </Link>
          <Link
            to="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 block"
          >
            Back to Home
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          If you believe this is an error, please contact your administrator.
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;