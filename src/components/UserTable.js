import axios from "axios";
import React, { useEffect, useState } from "react";

function UserTable() {
  const [data, setData] = useState([]);

  const getAllData = async () => {
    try {
      // const response = await axios.get(`http://localhost:5000/api/adminRoute/userData`);
      const response = await axios.get(`https://bot-backend-cy89.onrender.com/api/adminRoute/userData`);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  const updateDataRole = async (id, newRole) => {
    try {
      const response = await axios.put(`https://bot-backend-cy89.onrender.com/api/adminRoute/updateRole/${id}`, {
        role: newRole,
      });
      console.log("Updated role:", response.data);
      getAllData(); // refresh after update
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-blue-600">RT-BOT Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {["Dashboard", "Chats Overview", "Toxicity Alerts", "Machine Status", "Report Generator", "Settings"].map((item) => (
            <a key={item} href="#" className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium">
              {item}
            </a>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Admin</span>
            <img src="https://i.pravatar.cc/32" className="w-8 h-8 rounded-full" alt="Admin Avatar" />
          </div>
        </header>

        <div className="p-4">
          <div className="overflow-x-auto rounded-2xl shadow-lg">
            <table className="min-w-full bg-white text-sm text-left text-gray-700">
              <thead className="bg-gray-100 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">S.no</th>
                  <th className="px-6 py-3">Username</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Role</th>
                  {/* <th className="px-6 py-3">Action</th> */}
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    {console.log(user)}
                    <td className="px-6 py-4 font-medium text-gray-900">{user?.username}</td>
                    <td className="px-6 py-4">{user?.email}</td>
                    <td className="px-6 py-4">
                      <select
                        className="border rounded px-2 py-1"
                        value={user.role}
                        onChange={(e) => updateDataRole(user._id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="doctor">Doctor</option>
                        <option value="therapist">Therapist</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserTable;
