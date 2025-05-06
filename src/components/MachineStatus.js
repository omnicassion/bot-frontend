import React, { useEffect, useState } from 'react';

const MachineStatus = () => {
  const [machines, setMachines] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Offline');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');

  const tokenData = JSON.parse(localStorage.getItem('loginResponse'));
  const userRole = tokenData?.role;

  const fetchMachines = async () => {
    try {
      const response = await fetch('https://bot-backend-cy89.onrender.com/api/machines/get');
      const data = await response.json();
      setMachines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setMachines([]);
    }
  };

  useEffect(() => {
    setRole(userRole);
    fetchMachines();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('https://bot-backend-cy89.onrender.com/api/machines/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status, createdBy: tokenData?.username }),
      });
      setName('');
      setStatus('Offline');
      fetchMachines();
    } catch (err) {
      console.error('Create failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await fetch(`https://bot-backend-cy89.onrender.com/api/machines/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMachines();
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine?')) return;
    try {
      await fetch(`https://bot-backend-cy89.onrender.com/api/machines/${id}`, { method: 'DELETE' });
      fetchMachines();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Running': return 'bg-green-500';
      case 'Offline': return 'bg-red-500';
      case 'Maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center animate-fadeInUp">
          Machine Status Panel
        </h2>

        {/* Create Form */}
        {(role === 'admin' || role === 'therapist') && (
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Machine Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 transition-shadow shadow-sm hover:shadow-md"
              required
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 transition-shadow shadow-sm hover:shadow-md"
            >
              <option>Offline</option>
              <option>Running</option>
              <option>Maintenance</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 disabled:opacity-50 transition-transform transform hover:scale-105 duration-200"
            >
              {loading ? 'Adding...' : 'Add Machine'}
            </button>
          </form>
        )}

        {/* Machine Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <div
              key={machine._id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{machine.name}</h3>
              <div className="flex items-center justify-between">
                <span className={`text-white px-3 py-1 rounded-full ${statusColor(machine.status)}`}>  
                  {machine.status}
                </span>

                {(role === 'admin' || role === 'therapist') && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={machine.status}
                      onChange={(e) => handleStatusChange(machine._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-400 transition-shadow"
                    >
                      <option>Offline</option>
                      <option>Running</option>
                      <option>Maintenance</option>
                    </select>
                    <button
                      onClick={() => handleDelete(machine._id)}
                      className="text-red-500 hover:text-red-700 transition-transform hover:scale-110"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachineStatus;

/* Tailwind Animations - add to tailwind.config.js under theme.extend */
// animation: {
//   fadeInUp: 'fadeInUp 0.6s ease-out',
// },
// keyframes: {
//   fadeInUp: {
//     '0%': { opacity: '0', transform: 'translateY(20px)' },
//     '100%': { opacity: '1', transform: 'translateY(0)' },
//   },
// }
