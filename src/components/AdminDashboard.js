import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Brain,
  UserCheck,
  Calendar,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import apiService from '../services/apiService';

function AdminDashboard() {
  const [data, setData] = useState({ 
    users: 0, 
    doctor: 0, 
    alerts: 0,
    reports: 0,
    analyses: 0,
    machines: 0
  });
  const [recentReports, setRecentReports] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    api: 'healthy',
    database: 'healthy',
    analysis: 'healthy'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch admin count data (existing endpoint)
      try {
        const adminRes = await apiService.get('/adminRoute/adminCount');
        setData(prev => ({ ...prev, ...adminRes.data }));
      } catch (error) {
        console.warn('Admin count endpoint unavailable:', error);
      }

      // Fetch reports data
      try {
        const reportsRes = await apiService.reports.getAllReports();
        const reports = reportsRes.data.data || [];
        setData(prev => ({
          ...prev,
          reports: reports.length,
          analyses: reports.filter(r => r.analysisResults).length
        }));
        
        // Get recent reports (last 5)
        setRecentReports(reports.slice(0, 5));
      } catch (error) {
        console.warn('Reports endpoint unavailable:', error);
      }

      // Fetch machines data
      try {
        const machinesRes = await apiService.machines.getMachines();
        setData(prev => ({ ...prev, machines: machinesRes.data.data?.length || 0 }));
      } catch (error) {
        console.warn('Machines endpoint unavailable:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-[#128C7E]" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">System overview and management</p>
            </div>
            
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Link to="/user-management" className="block">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Users</h3>
              <p className="text-3xl font-bold text-gray-900">{data.users}</p>
              <p className="text-xs text-gray-500 mt-2">All system users</p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Medical Staff</h3>
            <p className="text-3xl font-bold text-gray-900">{data.doctor}</p>
            <p className="text-xs text-gray-500 mt-2">Doctors & Therapists</p>
          </div>

          <Link to="/reports" className="block">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Reports</h3>
              <p className="text-3xl font-bold text-gray-900">{data.reports}</p>
              <p className="text-xs text-gray-500 mt-2">Medical reports</p>
            </div>
          </Link>

          <Link to="/analysis" className="block">
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">AI Analyses</h3>
              <p className="text-3xl font-bold text-gray-900">{data.analyses}</p>
              <p className="text-xs text-gray-500 mt-2">Completed analyses</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Reports */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
              <Link 
                to="/reports" 
                className="text-[#128C7E] hover:text-[#075E54] text-sm font-medium transition-colors"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="w-6 h-6 border-4 border-[#128C7E] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div key={report._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#128C7E]/10 rounded-lg">
                        <FileText className="w-4 h-4 text-[#128C7E]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{report.userId}</p>
                        <p className="text-sm text-gray-500">
                          {report.diagnosis || 'No diagnosis'} • {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                        report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority || 'medium'}
                      </span>
                      {report.analysisResults && (
                        <div className="p-1 bg-green-100 rounded">
                          <Brain className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No reports available</p>
              </div>
            )}
          </div>

          {/* System Health & Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
              
              <div className="space-y-3">
                {Object.entries({
                  'API Status': systemHealth.api,
                  'Database': systemHealth.database,
                  'AI Analysis': systemHealth.analysis
                }).map(([key, status]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{key}</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-xs font-medium capitalize ${
                        status === 'healthy' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <Link 
                  to="/user-management"
                  className="w-full bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white p-3 rounded-xl text-center font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Manage Users
                </Link>
                
                <Link 
                  to="/reports"
                  className="w-full bg-blue-100 text-blue-700 p-3 rounded-xl text-center font-medium hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  View Reports
                </Link>
                
                <Link 
                  to="/machine"
                  className="w-full bg-gray-100 text-gray-700 p-3 rounded-xl text-center font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Machine Status
                </Link>
              </div>
            </div>

            {data.alerts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">System Alerts</h3>
                </div>
                <p className="text-yellow-700 text-sm mb-3">
                  You have {data.alerts} pending alert{data.alerts !== 1 ? 's' : ''} that require attention.
                </p>
                <button className="text-yellow-800 text-sm font-medium hover:underline">
                  View Alerts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
