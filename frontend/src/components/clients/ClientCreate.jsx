import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import AfInput from '../ui/AfInput';

function ClientCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axiosClient.post('/clients', formData);
      navigate('/clients');
    } catch (err) {
      console.error('Error creating client:', err);
      setError('Failed to create client.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Client</h1>
      <AfCard className="p-6 shadow-md rounded-lg max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <AfInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <AfInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <AfInput
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex space-x-4">
            <AfButton type="submit" variant="primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Client'}
            </AfButton>
            <AfButton type="button" variant="secondary" onClick={() => navigate('/clients')}>
              Cancel
            </AfButton>
          </div>
        </form>
      </AfCard>
    </div>
  );
}

export default ClientCreate;