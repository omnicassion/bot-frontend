import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService, { apiUtils } from '../services/apiService';
import Navbar from './Navbar';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        // Registration
        const userData = { username, password, email };
        await apiService.auth.register(userData);
        
        // Show success message and switch to login
        setRegistrationSuccess(true);
        setIsRegistering(false);
        setEmail(''); // Clear email field
      } else {
        // Login
        const userData = { username, password };
        const response = await apiService.auth.login(userData);
        const data = response.data;

        localStorage.setItem('loginResponse', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email || '',
          role: data.role,
          token: data.token,
        }));

        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/chat");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError(apiUtils.handleApiError(error, isRegistering ? 'Registration failed' : 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setError('');
    setRegistrationSuccess(false);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      <div className="flex items-center justify-center p-4 pt-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {isRegistering ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-gray-600">
                {isRegistering ? 'Sign up for your account' : 'Sign in to your account'}
              </p>
            </div>

            {registrationSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-green-600 text-sm">
                Registration successful! Please log in with your credentials.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isRegistering && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#128C7E] text-white py-3 rounded-lg shadow hover:bg-[#075E54] disabled:opacity-50 transition-all duration-200"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  isRegistering ? 'Create Account' : 'Sign In'
                )}
              </button>
            </form>

            <button
              onClick={toggleMode}
              className="mt-4 text-sm text-blue-600 hover:underline block mx-auto"
            >
              {isRegistering
                ? 'Already have an account? Sign In'
                : 'Need an account? Create Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
