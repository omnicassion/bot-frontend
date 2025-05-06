import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [data, setData] = useState({ users: 0, doctor: 0, alerts: 0 });

  useEffect(() => {
    const getAllData = async () => {
      try {
        const res = await axios.get(
          'https://bot-backend-cy89.onrender.com/api/adminRoute/adminCount'
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    getAllData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link to="/UserTable" className="block">
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h2 className="text-gray-600 mb-2 font-medium">Total Users</h2>
              <p className="text-4xl font-bold text-blue-600">{data.users}</p>
            </div>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-gray-600 mb-2 font-medium">Total Doctors</h2>
            <p className="text-4xl font-bold text-red-500">{data.doctor}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-gray-600 mb-2 font-medium">Alerts</h2>
            <p className="text-4xl font-bold text-yellow-500">{data.alerts}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow sm:col-span-2 md:col-span-3">
            <h2 className="text-gray-600 mb-2 font-medium">Machine Status</h2>
            <p className="text-4xl font-bold text-green-500">Operational</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
