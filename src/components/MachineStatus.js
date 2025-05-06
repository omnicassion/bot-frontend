import React, { useEffect, useState } from 'react';

const MachineStatus = () => {
  const [machines, setMachines] = useState([]);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Offline');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('');
  const [error, setError] = useState(null);

  const tokenData = JSON.parse(localStorage.getItem('loginResponse'));
  const userRole = tokenData?.role;

  const fetchMachines = async () => {
    try {
      const response = await fetch('https://bot-backend-cy89.onrender.com/api/machines/get');
      const data = await response.json();
      setMachines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setError('Failed to fetch machine status');
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
      setError('Failed to create machine');
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
      setError('Failed to update machine status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this machine?')) return;
    try {
      await fetch(`https://bot-backend-cy89.onrender.com/api/machines/${id}`, { method: 'DELETE' });
      fetchMachines();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete machine');
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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#128C7E] to-[#075E54] text-white px-6 py-4 shadow-lg fixed top-0 right-0 md:left-64 left-0 z-10">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">⚙️</span> Machine Status
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm bg-white/20 px-3 py-1 rounded-full">Live Monitoring</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full overflow-y-auto px-4 pt-20 pb-8">
        <div className="max-w-4xl mx-auto min-h-[calc(100vh-8rem)]">
          {/* Create Form */}
          {(role === 'admin' || role === 'therapist') && (
            <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Machine Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                  required
                />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                >
                  <option>Offline</option>
                  <option>Running</option>
                  <option>Maintenance</option>
                </select>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#128C7E] text-white px-6 py-2 rounded-lg shadow hover:bg-[#075E54] disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? 'Adding...' : 'Add Machine'}
                </button>
              </div>
            </form>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-600">
              {error}
            </div>
          )}

          {/* Machine Grid */}
          <div className="grid gap-4 pb-4">
            {machines.map((machine) => (
              <div
                key={machine._id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">{machine.name}</h3>
                  <span className={`text-white px-3 py-1 rounded-full ${statusColor(machine.status)}`}>
                    {machine.status}
                  </span>
                </div>

                {(role === 'admin' || role === 'therapist') && (
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                    <select
                      value={machine.status}
                      onChange={(e) => handleStatusChange(machine._id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-[#128C7E] focus:border-transparent transition-all duration-200"
                    >
                      <option>Offline</option>
                      <option>Running</option>
                      <option>Maintenance</option>
                    </select>
                    <button
                      onClick={() => handleDelete(machine._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
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
