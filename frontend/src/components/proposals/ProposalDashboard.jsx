import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import AfInput from '../ui/AfInput';
import Skeletons from '../ui/Skeletons';
import FadeIn from '../ui/FadeIn';

export const ProposalDashboard = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/proposals');
      setProposals(response.data.data || []);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to load proposals.');
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (proposalId) => {
    try {
      setActionLoading(prev => ({ ...prev, [proposalId]: true }));
      await axiosClient.post('/proposals/send', { proposalId });
      // Refresh list
      await fetchProposals();
    } catch (err) {
      console.error('Error sending proposal:', err);
      alert('Failed to send proposal.');
    } finally {
      setActionLoading(prev => ({ ...prev, [proposalId]: false }));
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': 
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      case 'sent': 
        return { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' };
      case 'viewed': 
        return { backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
      case 'declined': 
        return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' };
      case 'pending': 
        return { backgroundColor: '#ffedd5', color: '#9a3412', border: '1px solid #fed7aa' };
      default: 
        return { backgroundColor: 'var(--af-secondary)', color: 'var(--af-text-muted)', border: '1px solid var(--af-border)' };
    }
  };

  const filteredProposals = proposals.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.client?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: proposals.length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    sent: proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length,
    pending: proposals.filter(p => p.status === 'pending' || p.status === 'draft').length
  };

  if (loading) return <Skeletons type="dashboard" />;

  return (
    <div className="af-dashboard fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Proposals</h1>
          <p className="af-muted" style={{ margin: '4px 0 0 0' }}>Draft, dispatch, and track client contracts</p>
        </div>
        <AfButton onClick={() => navigate('/proposals/new')} variant="primary">
          ➕ New Proposal
        </AfButton>
      </div>

      {/* Stats Cards */}
      <div className="af-card-grid">
        <FadeIn delay={50}>
          <AfCard className="hover-lift">
            <h3 className="af-muted" style={{ fontSize: '12px', margin: 0, letterSpacing: '0.05em' }}>TOTAL PROPOSALS</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0' }}>{stats.total}</p>
          </AfCard>
        </FadeIn>
        <FadeIn delay={100}>
          <AfCard className="hover-lift">
            <h3 style={{ fontSize: '12px', margin: 0, letterSpacing: '0.05em', color: '#166534' }}>ACCEPTED</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0', color: '#166534' }}>{stats.accepted}</p>
          </AfCard>
        </FadeIn>
        <FadeIn delay={150}>
          <AfCard className="hover-lift">
            <h3 style={{ fontSize: '12px', margin: 0, letterSpacing: '0.05em', color: '#1e40af' }}>SENT / OUTSTANDING</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0', color: '#1e40af' }}>{stats.sent}</p>
          </AfCard>
        </FadeIn>
        <FadeIn delay={200}>
          <AfCard className="hover-lift">
            <h3 style={{ fontSize: '12px', margin: 0, letterSpacing: '0.05em', color: '#9a3412' }}>PENDING DRAFT</h3>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0 0 0', color: '#9a3412' }}>{stats.pending}</p>
          </AfCard>
        </FadeIn>
      </div>

      {/* Main Listing */}
      <AfCard className="mb-24">
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <AfInput
            type="text"
            placeholder="Search by proposal title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {error && (
          <div className="af-card" style={{ borderColor: 'var(--af-danger)', backgroundColor: '#fff5f5' }}>
            <p style={{ color: 'var(--af-danger)', margin: 0 }}>{error}</p>
          </div>
        )}

        {!error && filteredProposals.length === 0 ? (
          <p className="af-muted" style={{ textAlign: 'center', padding: '40px 0' }}>No proposals found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--af-border)' }}>
                  <th style={{ padding: '12px 16px', color: 'var(--af-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>PROPOSAL</th>
                  <th style={{ padding: '12px 16px', color: 'var(--af-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>CLIENT</th>
                  <th style={{ padding: '12px 16px', color: 'var(--af-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>VALUE</th>
                  <th style={{ padding: '12px 16px', color: 'var(--af-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', color: 'var(--af-text-muted)', fontSize: '12px', fontWeight: 'bold' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProposals.map((proposal, idx) => (
                  <tr key={proposal.id} style={{ borderBottom: '1px solid var(--af-border)', transition: 'background-color 0.2s' }}>
                    <td style={{ padding: '16px', fontWeight: '600' }}>{proposal.title}</td>
                    <td style={{ padding: '16px' }}>{proposal.client?.name || 'Unknown Client'}</td>
                    <td style={{ padding: '16px', fontWeight: 'bold' }}>${parseFloat(proposal.totalAmount || 0).toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>
                      <span className="af-status-pill" style={getStatusStyle(proposal.status)}>
                        {proposal.status?.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', display: 'flex', gap: '8px' }}>
                      <AfButton
                        variant="secondary"
                        onClick={() => navigate(`/proposal/${proposal.id}`)}
                        className="af-btn-small"
                      >
                        👁️ View Page
                      </AfButton>
                      {(proposal.status === 'pending' || proposal.status === 'draft') && (
                        <AfButton
                          variant="primary"
                          onClick={() => handleSend(proposal.id)}
                          className="af-btn-small"
                          disabled={actionLoading[proposal.id]}
                        >
                          ✉️ {actionLoading[proposal.id] ? 'Sending...' : 'Send to Client'}
                        </AfButton>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AfCard>
    </div>
  );
};

export default ProposalDashboard;
