import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 px-4'>
      <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-md'>
        <h2 className='text-2xl font-bold mb-6 text-center text-blue-700'>
          Welcome to the RT Bot
        </h2>

        <div className='flex justify-center'>
          <Link
            to='/login'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
