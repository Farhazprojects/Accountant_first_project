import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import AfInput from '../ui/AfInput';
import FadeIn from '../ui/FadeIn';

export const ProposalCreate = () => {
  const [clients, setClients] = useState([]);
  const [clientId, setClientId] = useState('');
  const [title, setTitle] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingClients, setFetchingClients] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setFetchingClients(true);
        const response = await axiosClient.get('/clients');
        setClients(response.data.data || []);
        if (response.data.data?.length > 0) {
          setClientId(response.data.data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch clients for proposal creation:', err);
        setError('Failed to fetch clients. Please try again.');
      } finally {
        setFetchingClients(false);
      }
    };
    fetchClients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !title || !totalAmount) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await axiosClient.post('/proposals', {
        clientId,
        title,
        description,
        totalAmount: parseFloat(totalAmount),
        status: 'pending' // As expected by the tests and dashboard
      });
      navigate('/proposals');
    } catch (err) {
      console.error('Failed to create proposal:', err);
      setError(err.response?.data?.error || 'Failed to create proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="af-dashboard fade-in">
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <AfButton variant="secondary" onClick={() => navigate('/proposals')} className="af-btn-small">
          ⬅️ Back
        </AfButton>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Create New Proposal</h1>
      </div>

      <FadeIn delay={100}>
        <AfCard style={{ maxWidth: '600px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="af-card mb-24" style={{ borderColor: 'var(--af-danger)', backgroundColor: '#fff5f5', padding: '12px' }}>
                <p style={{ color: 'var(--af-danger)', margin: 0, fontSize: '14px' }}>{error}</p>
              </div>
            )}

            <div className="mb-24">
              <label className="af-label" htmlFor="client-select">CLIENT *</label>
              {fetchingClients ? (
                <p className="af-muted">Loading clients...</p>
              ) : (
                <select
                  id="client-select"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="af-input"
                  style={{
                    backgroundColor: 'var(--af-card-bg)',
                    color: 'var(--af-text-main)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    borderColor: 'var(--af-border)'
                  }}
                  required
                >
                  <option value="" disabled>Select a client</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
                  ))}
                </select>
              )}
            </div>

            <div className="mb-24">
              <label className="af-label" htmlFor="proposal-title">PROPOSAL TITLE *</label>
              <AfInput
                id="proposal-title"
                type="text"
                placeholder="e.g. Annual Corporate Bookkeeping Scope"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-24">
              <label className="af-label" htmlFor="proposal-value">PROPOSAL VALUE ($) *</label>
              <AfInput
                id="proposal-value"
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g. 850.00"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                required
              />
            </div>

            <div className="mb-24">
              <label className="af-label" htmlFor="proposal-desc">DESCRIPTION / SCOPE NOTES</label>
              <textarea
                id="proposal-desc"
                placeholder="Describe the scope of work..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="af-input"
                style={{
                  height: '120px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  backgroundColor: 'var(--af-card-bg)',
                  color: 'var(--af-text-main)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <AfButton type="button" variant="secondary" onClick={() => navigate('/proposals')} disabled={loading}>
                Cancel
              </AfButton>
              <AfButton type="submit" variant="primary" disabled={loading || fetchingClients}>
                {loading ? 'Creating...' : 'Create Proposal'}
              </AfButton>
            </div>
          </form>
        </AfCard>
      </FadeIn>
    </div>
  );
};

export default ProposalCreate;
