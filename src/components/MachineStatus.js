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
    const response = await fetch('http://localhost:5000/api/machines/get');
    const data = await response.json();

    if (Array.isArray(data)) {
      setMachines(data);
    } else {
      console.warn('Unexpected response:', data);
      setMachines([]);
    }
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
      await fetch('http://localhost:5000/api/machines/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          status,
          createdBy: tokenData?.username,
        }),
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
      await fetch(`http://localhost:5000/api/machines/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
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
      await fetch(`http://localhost:5000/api/machines/${id}`, {
        method: 'DELETE',
      });
      fetchMachines();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Running':
        return 'bg-green-500';
      case 'Offline':
        return 'bg-red-500';
      case 'Maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Machine Status Panel</h2>

      {(role === 'admin' || role === 'therapist') && (
        <form onSubmit={handleCreate} className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Machine Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input input-bordered w-full max-w-sm border p-2 rounded"
            required
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Offline">Offline</option>
            <option value="Running">Running</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {loading ? 'Adding...' : 'Add Machine'}
          </button>
        </form>
      )}

      <div className="grid gap-4">
        {machines.map((machine) => (
          <div key={machine._id} className="border rounded-lg p-4 shadow flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{machine.name}</h3>
             
            </div>

            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <span className={`px-3 py-1 rounded-full text-white ${statusColor(machine.status)}`}>
                {machine.status}
              </span>

              {(role === 'admin' || role === 'therapist') && (
                <>
                  <select
                    value={machine.status}
                    onChange={(e) => handleStatusChange(machine._id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="Offline">Offline</option>
                    <option value="Running">Running</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>

                  <button
                    onClick={() => handleDelete(machine._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatus;
