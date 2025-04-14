import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isRegistering
       ? 'https://bot-backend-cy89.onrender.com/api/auth/register'
      //? 'http://localhost:5000/api/auth/register'
       : 'https://bot-backend-cy89.onrender.com/api/auth/login';
      //: 'http://localhost:5000/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email}),
      });

      const data = await response.json();
      console.log(data,"data")

      if (response.ok) {
        localStorage.setItem('loginResponse', JSON.stringify({
          id: data.id,
          username: data.username,
          email: data.username,
          role: data.role
        }));
        if(data.role==="admin"){
          navigate("/adminDashboard")
        }else{
        navigate('/chat');

        }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
           {isRegistering?<input
            type="email"
            placeholder="Enter your Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />:""}
          <input
            type="text"
            placeholder="Username"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          />
         
          

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {isRegistering ? 'Register' : 'Login'}
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
  );
}

export default Login;
