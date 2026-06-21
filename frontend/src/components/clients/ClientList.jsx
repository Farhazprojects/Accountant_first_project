import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import AfInput from '../ui/AfInput';
import Skeletons from '../ui/Skeletons';

function ClientList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/clients');
      setClients(response.data.data);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Failed to load clients.');
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <Skeletons type="list" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Clients</h1>
      <div className="flex justify-between items-center mb-4">
        <AfInput
          type="text"
          placeholder="Search clients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
        <AfButton as="link" to="/clients/new" variant="primary">
          Add New Client
        </AfButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <AfCard key={client.id} className="p-4 shadow-md rounded-lg">
              <h2 className="text-xl font-semibold mb-2">{client.name}</h2>
              <p className="text-gray-600 mb-2">{client.email}</p>
              <p className="text-gray-600 mb-4">Status: {client.onboardingStatus}</p>
              <AfButton as="link" to={`/clients/${client.id}`} variant="secondary">
                View Details
              </AfButton>
            </AfCard>
          ))
        ) : (
          <p>No clients found.</p>
        )}
      </div>
    </div>
  );
}

export default ClientList;