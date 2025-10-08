import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './components/Login';
import Chat from './components/Chat';
import Report from './components/Report';
import ReportAnalysis from './components/ReportAnalysis';
import MachineStatus from './components/MachineStatus';
import MachineStatusViewOnly from './components/MachineStatusViewOnly';
import Home from './components/Home';
import AdminDashboard from './components/AdminDashboard';
import UserTable from './components/UserTable';
import Unauthorized from './components/Unauthorized';
import ProtectedRoute, { 
  AdminRoute, 
  DoctorRoute, 
  TherapistRoute, 
  MedicalStaffRoute, 
  UserRoute,
  useUserRole 
} from './components/ProtectedRoute';

// Enhanced Report Components
import ReportsPage from './components/ReportsPage';
import AnalysisPage from './components/AnalysisPage';
import UserManagement from './components/UserManagement';
import Settings from './components/Settings';
import PIQFormPage from './components/PIQFormPage';

function App() {
  return (
    <Routes>
      {/* Public Routes WITHOUT Sidebar/Navbar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes WITH Sidebar/Layout */}
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        {/* Admin Only Routes */}
        <Route path="/admin-dashboard" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        
        <Route path="/user-management" element={
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        } />

        <Route path="/UserTable" element={
          <AdminRoute>
            <UserTable />
          </AdminRoute>
        } />

        {/* Medical Staff Routes (Admin, Doctor, Therapist) */}
        <Route path="/reports" element={
          <MedicalStaffRoute>
            <ReportsPage />
          </MedicalStaffRoute>
        } />

        <Route path="/analysis" element={
          <MedicalStaffRoute>
            <AnalysisPage />
          </MedicalStaffRoute>
        } />

        {/* All Authenticated Users */}
        <Route path="/chat" element={
          <UserRoute>
            <Chat />
          </UserRoute>
        } />

        <Route path="/report" element={
          <UserRoute>
            <Report />
          </UserRoute>
        } />

        <Route path="/analyze" element={
          <TherapistRoute>
            <ReportAnalysis />
          </TherapistRoute>
        } />

        <Route path="/settings" element={
          <UserRoute>
            <Settings />
          </UserRoute>
        } />

        {/* PIQ Forms - Therapist, Doctor, Admin access */}
        <Route path="/piq-forms" element={
          <MedicalStaffRoute>
            <PIQFormPage />
          </MedicalStaffRoute>
        } />

        {/* Machine Status - Role-based component selection */}
        <Route path="/machine" element={
          <UserRoute>
            <MachineStatusWrapper />
          </UserRoute>
        } />
      </Route>
    </Routes>
  );
}

// Wrapper component to choose machine status component based on role
const MachineStatusWrapper = () => {
  const userRole = useUserRole();
  
  if (userRole === 'user') {
    return <MachineStatusViewOnly />;
  }
  
  return <MachineStatus />;
};

export default App;
