import React, { useEffect, useState } from 'react';
import apiService, { apiUtils } from '../services/apiService';

const MachineStatusViewOnly = () => {
  const [machines, setMachines] = useState([]);

  const fetchMachines = async () => {
    try {
      const response = await apiService.machines.getMachines();
      const data = response.data;
      if (Array.isArray(data)) {
        setMachines(data);
      }
    } catch (error) {
      console.error('Error fetching machines:', error);
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

  useEffect(() => {
    fetchMachines();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Machine Status</h2>
      <div className="grid gap-4">
        {machines.map((machine) => (
          <div key={machine._id} className="border rounded-lg p-4 shadow flex justify-between items-center">
            <h3 className="text-lg font-semibold">{machine.name}</h3>
            <span className={`px-3 py-1 rounded-full text-white ${statusColor(machine.status)}`}>
              {machine.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatusViewOnly;
