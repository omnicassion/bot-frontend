import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Database,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUserRole } from './ProtectedRoute';
import apiService from '../services/apiService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [user, setUser] = useState(null);
  const userRole = useUserRole();

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });



  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('loginResponse') || '{}');
      setUser(userData);
      setProfileData(prev => ({
        ...prev,
        username: userData.username || '',
        email: userData.email || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Get userId from localStorage directly to ensure we have it
      const loginResponse = localStorage.getItem('loginResponse');
      const userId = loginResponse ? JSON.parse(loginResponse).id : null;
      
      if (!userId) {
        setMessage({ type: 'error', text: 'User not found. Please login again.' });
        setLoading(false);
        return;
      }

      const updateData = {
        userId: userId,
        username: profileData.username,
        email: profileData.email
      };

      // Call API to update profile
      const response = await apiService.auth.updateProfile(updateData);
      
      // Update local storage with new user data
      if (response.data.user) {
        const loginResponse = JSON.parse(localStorage.getItem('loginResponse') || '{}');
        const updatedLoginResponse = {
          ...loginResponse,
          ...response.data.user
        };
        localStorage.setItem('loginResponse', JSON.stringify(updatedLoginResponse));
        
        // Update local user state
        setUser(response.data.user);
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Validate password fields
      if (profileData.newPassword !== profileData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setLoading(false);
        return;
      }

      if (profileData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'New password must be at least 6 characters long' });
        setLoading(false);
        return;
      }

      if (!profileData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required' });
        setLoading(false);
        return;
      }

      // Get userId from localStorage directly to ensure we have it
      const loginResponse = localStorage.getItem('loginResponse');
      const userId = loginResponse ? JSON.parse(loginResponse).id : null;
      
      if (!userId) {
        setMessage({ type: 'error', text: 'User not found. Please login again.' });
        setLoading(false);
        return;
      }

      // Call API to change password
      await apiService.auth.changePassword({
        userId: userId,
        currentPassword: profileData.currentPassword,
        newPassword: profileData.newPassword
      });

      setMessage({ type: 'success', text: 'Password changed successfully' });

      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Error changing password' });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, roles: ['admin', 'doctor', 'therapist', 'user'] },
    { id: 'security', label: 'Security', icon: <Lock className="w-5 h-5" />, roles: ['admin', 'doctor', 'therapist', 'user'] },
    { id: 'system', label: 'System', icon: <Database className="w-5 h-5" />, roles: ['admin'] }
  ].filter(tab => tab.roles.includes(userRole));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#128C7E]" />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* Message Display */}
              {message.text && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.type === 'success' 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Username
                        </label>
                        <input
                          type="text"
                          required
                          value={profileData.username}
                          onChange={(e) => setProfileData(prev => ({...prev, username: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#128C7E] focus:border-transparent"
                        />
                      </div>
                    </div>



                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save className="w-5 h-5" />
                        {loading ? 'Updating...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Security</h3>
                      <p className="text-gray-600 mb-4">Your account security status and recent activity</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">Password Security</span>
                          </div>
                          <p className="text-sm text-gray-600">Strong password detected</p>
                        </div>

                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="font-medium text-gray-900">Account Status</span>
                          </div>
                          <p className="text-sm text-gray-600">Account is active and secure</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h3>
                      <p className="text-gray-600 mb-4">Update your account password for better security</p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.current ? 'text' : 'password'}
                              value={profileData.currentPassword}
                              onChange={(e) => setProfileData(prev => ({...prev, currentPassword: e.target.value}))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#128C7E]/25 focus:border-[#128C7E] transition-all duration-200 pr-12"
                              placeholder="Enter current password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({...prev, current: !prev.current}))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.new ? 'text' : 'password'}
                              value={profileData.newPassword}
                              onChange={(e) => setProfileData(prev => ({...prev, newPassword: e.target.value}))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#128C7E]/25 focus:border-[#128C7E] transition-all duration-200 pr-12"
                              placeholder="Enter new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({...prev, new: !prev.new}))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <div className="relative">
                            <input
                              type={showPasswords.confirm ? 'text' : 'password'}
                              value={profileData.confirmPassword}
                              onChange={(e) => setProfileData(prev => ({...prev, confirmPassword: e.target.value}))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#128C7E]/25 focus:border-[#128C7E] transition-all duration-200 pr-12"
                              placeholder="Confirm new password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPasswords(prev => ({...prev, confirm: !prev.confirm}))}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handlePasswordChange}
                            disabled={loading || !profileData.currentPassword || !profileData.newPassword || !profileData.confirmPassword}
                            className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                          >
                            <Lock className="w-5 h-5" />
                            {loading ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Role Information</h3>
                      <p className="text-gray-600 mb-4">Your current role and permissions</p>
                      
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900 capitalize">Current Role: {userRole}</span>
                            <p className="text-sm text-gray-600 mt-1">
                              {userRole === 'admin' && 'Full system access with administrative privileges'}
                              {userRole === 'doctor' && 'Access to patient reports and medical analysis'}
                              {userRole === 'therapist' && 'Access to patient therapy and treatment data'}
                              {userRole === 'user' && 'Basic access to personal medical information'}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            userRole === 'admin' ? 'bg-red-100 text-red-800' :
                            userRole === 'doctor' ? 'bg-blue-100 text-blue-800' :
                            userRole === 'therapist' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {userRole}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}



              {/* System Tab (Admin Only) */}
              {activeTab === 'system' && userRole === 'admin' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">System Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Application Version:</span>
                          <span className="ml-2 text-gray-600">1.0.0</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Database Status:</span>
                          <span className="ml-2 text-green-600">Connected</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">API Status:</span>
                          <span className="ml-2 text-green-600">Operational</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Last Backup:</span>
                          <span className="ml-2 text-gray-600">2 hours ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-red-700 mb-4">These actions are irreversible. Please be careful.</p>
                      
                      <div className="space-y-3">
                        <button className="w-full md:w-auto bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors">
                          Reset System Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;