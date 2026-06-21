
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import AfInput from '../ui/AfInput';
import Skeletons from '../ui/Skeletons';

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    onboardingStatus: '',
  });

  useEffect(() => {
    fetchClient();
  }, [id]);

  const fetchClient = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/clients/${id}`);
      setClient(response.data.data);
      setFormData(response.data.data);
    } catch (err) {
      console.error('Error fetching client:', err);
      setError('Failed to load client details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axiosClient.put(`/clients/${id}`, formData);
      setIsEditing(false);
      fetchClient(); // Re-fetch client data to show updated info
    } catch (err) {
      console.error('Error updating client:', err);
      setError('Failed to update client.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await axiosClient.delete(`/clients/${id}`);
        navigate('/clients'); // Redirect to client list after deletion
      } catch (err) {
        console.error('Error deleting client:', err);
        setError('Failed to delete client.');
      }
    }
  };

  if (loading) {
    return <Skeletons type="detail" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!client) {
    return <div className="text-center">Client not found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Client Details: {client.name}</h1>
      <AfCard className="p-6 shadow-md rounded-lg">
        {isEditing ? (
          <div className="space-y-4">
            <AfInput
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
            <AfInput
              label="Onboarding Status"
              name="onboardingStatus"
              value={formData.onboardingStatus}
              onChange={handleChange}
            />
            <div className="flex space-x-4">
              <AfButton onClick={handleUpdate} variant="primary">Save</AfButton>
              <AfButton onClick={() => setIsEditing(false)} variant="secondary">Cancel</AfButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p><strong>Name:</strong> {client.name}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            <p><strong>Onboarding Status:</strong> {client.onboardingStatus}</p>
            <p><strong>Xero Contact ID:</strong> {client.xeroContactId || 'N/A'}</p>
            <div className="flex space-x-4 mt-6">
              <AfButton onClick={() => setIsEditing(true)} variant="primary">Edit Client</AfButton>
              <AfButton onClick={handleDelete} variant="danger">Delete Client</AfButton>
            </div>
          </div>
        )}
      </AfCard>
    </div>
  );
}

export default ClientDetail;
