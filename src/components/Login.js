import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [zoom, setZoom] = useState(false);

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
          email: data.email || '',
          role: data.role,
        }));

        setZoom(true);

        setTimeout(() => {
          navigate(data.role === "admin" ? "/adminDashboard" : "/chat");
        }, 500);
      } else {
        console.log('Response:', data);
        alert(data.error || 'Error logging in/registering user');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };

  return (
    <>
      {/* Full-screen Zoom Animation */}
      {zoom && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center animate-zoomOut">
          <img
            src="/machine.jpg"
            alt="Zoom Logo"
            className="w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full object-cover"
          />
        </div>
      )}

      {/* Login/Register Wrapper */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-xl">
          {/* Logo */}
          <div className="flex justify-center mb-5 sm:mb-6">
            <img
              src="/machine.jpg"
              alt="Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full shadow-md"
            />
          </div>

          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 mb-4 sm:mb-6">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {isRegistering && (
              <input
                type="email"
                placeholder="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <button
              type="submit"
              className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </form>

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-4 w-full text-sm text-center text-blue-600 hover:underline"
          >
            {isRegistering
              ? 'Already have an account? Login'
              : 'Don’t have an account? Register'}
          </button>
        </div>
      </div>

      {/* Tailwind Utility Animation */}
      <style>{`
        @layer utilities {
          @keyframes zoomOut {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(5);
              opacity: 0;
            }
          }

          .animate-zoomOut {
            animation: zoomOut 0.5s ease-out forwards;
          }
        }
      `}</style>
    </>
  );
}

export default Login;
