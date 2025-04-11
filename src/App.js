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

function App() {
  return (
    <Routes>
     
<Route path="/" element={<Home />}>
      {/* Protected Routes under Layout */}
      <Route element={<Layout />}>
       {/* Public Route */}
      <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/report" element={<Report />} />
        <Route path="/analyze" element={<ReportAnalysis />} />
        {/* <Route path="/machine" element={<MachineStatus />} /> */}
        
<Route
  path="/machine"
  element={
    JSON.parse(localStorage.getItem('loginResponse'))?.role === 'user'
      ? <MachineStatusViewOnly />
      : <MachineStatus />
  }
/>
      </Route>
    </Routes>
  );
}

export default App;
