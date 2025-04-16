import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminDashboard() {
    const [data,setData]=useState(0)

    const getAllData=async()=>{
        try {
            const dataaa=await axios.get(`https://bot-backend-cy89.onrender.com/api/adminRoute/adminCount`)
            // const dataaa=await axios.get(`http://localhost:5000/api/adminRoute/adminCount`)
            console.log(dataaa)
            setData(dataaa.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
getAllData()
    },[])
  return (
    <div>
      <>
  {/* AdminDashboard.html */}
  <div className="flex h-screen bg-gray-100 font-sans">
    {/* Sidebar */}
    <div className="w-64 bg-white shadow-md flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-blue-600">RT-BOT Admin</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a
          href="#"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Chats Overview
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Toxicity Alerts
        </a>
        <a
          href="/machine"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Machine Status
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Report Generator
        </a>
        <a
          href="#"
          className="block px-4 py-2 rounded hover:bg-blue-100 text-gray-700 font-medium"
        >
          Settings
        </a>
      </nav>
    </div>
    {/* Main Content */}
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Admin</span>
          <img
            src="https://i.pravatar.cc/32"
            className="w-8 h-8 rounded-full"
            alt="Admin Avatar"
          />
        </div>
      </header>
      {/* Page Content */}
      <main className="p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
         <Link to={"/UserTable"}>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-gray-600 mb-2 font-medium">Total Users</h2>
            <p className="text-3xl font-bold text-blue-600">{data?.users}</p>
          </div>
         </Link>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-gray-600 mb-2 font-medium">Total Doctor</h2>
            <p className="text-3xl font-bold text-red-500">{data?.doctor}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-gray-600 mb-2 font-medium">Alerts</h2>
            <p className="text-3xl font-bold text-red-500">{data?.alerts}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h2 className="text-gray-600 mb-2 font-medium">Machine Status</h2>
            <p className="text-3xl font-bold text-green-500">Operational</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</>

    </div>
  )
}

export default AdminDashboard
