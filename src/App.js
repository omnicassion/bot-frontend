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

function App() {
  const role = JSON.parse(localStorage.getItem('loginResponse'))?.role;

  return (
    <Routes>
      {/* Routes WITHOUT Sidebar/Navbar */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Routes WITH Sidebar/Layout */}
      <Route element={<Layout />}>
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/UserTable" element={<UserTable />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/report" element={<Report />} />
        <Route path="/analyze" element={<ReportAnalysis />} />

        <Route
          path="/machine"
          element={role === 'user' ? <MachineStatusViewOnly /> : <MachineStatus />}
        />
      </Route>
    </Routes>
  );
}

export default App;
