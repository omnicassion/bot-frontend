import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegistering
      ? 'https://bot-backend-cy89.onrender.com/api/auth/register'
      : 'https://bot-backend-cy89.onrender.com/api/auth/login';

    try {
      const bodyData = isRegistering
        ? { username, password, email }
        : { username, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      console.log(data, "data");

      if (response.ok) {
        localStorage.setItem('loginResponse', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.email || '',  // <-- fallback if email is missing
          role: data.role,
        }));

        if (data.role === "admin") {
          navigate("/adminDashboard");
        } else {
          navigate("/chat");
        }
      } else {
        console.log('Response:', data);
        setError(data.error || 'Error logging in/registering user');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

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
                'Sign In'
              )}
            </button>
          </form>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-4 text-sm text-blue-600 hover:underline block mx-auto"
          >
            {isRegistering
              ? 'Already have an account? Login'
              : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
