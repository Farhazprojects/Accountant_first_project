import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import FadeIn from '../ui/FadeIn';

export const BillingPortal = () => {
  const [billingInfo, setBillingInfo] = useState({ status: 'loading', plan: 'None' });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchBillingStatus = async () => {
      try {
        const response = await axiosClient.get('/billing/status');
        setBillingInfo(response.data.data);
      } catch (err) {
        setBillingInfo({ status: 'error', plan: 'Unidentified' });
      }
    };
    fetchBillingStatus();
  }, []);

  const handleSubscribe = async (priceId) => {
    setIsProcessing(true);
    try {
      const response = await axiosClient.post('/billing/checkout', { priceId });
      // Redirect out directly to Stripe's ultra-secure hosted checkout flow
      window.location.href = response.data.data.checkoutUrl;
    } catch (err) {
      alert('Could not launch subscription flow. Try again.');
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    setIsProcessing(true);
    try {
      const response = await axiosClient.post('/billing/portal');
      window.location.href = response.data.data.portalUrl;
    } catch (err) {
      alert('Could not open self-service portal.');
      setIsProcessing(false);
    }
  };

  if (billingInfo.status === 'loading') return <div className="af-dashboard af-muted">Loading Subscription matrix...</div>;

  return (
    <div className="af-dashboard">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0' }}>Subscription & Plan Management</h1>
        <p className="af-muted" style={{ margin: 0 }}>Review statements, adjust tiers, or upgrade seats.</p>
      </div>

      <FadeIn className="af-card mb-24" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0' }}>Current Tier: {billingInfo.plan}</h3>
          <p className="af-muted" style={{ margin: 0 }}>
            Account Standing Status: 
            <span style={{ 
              marginLeft: '6px', 
              fontWeight: 'bold', 
              color: billingInfo.status === 'active' ? '#166534' : 'var(--af-danger)'
            }}>
              {billingInfo.status.toUpperCase()}
            </span>
          </p>
        </div>

        {billingInfo.status === 'active' && (
          <button 
            className="af-btn af-btn-outline hover-lift" 
            onClick={handleManageBilling}
            disabled={isProcessing}
          >
            Update Payment Methods
          </button>
        )}
      </FadeIn>

      {/* Pricing Matrix if Not Active */}
      {billingInfo.status !== 'active' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <FadeIn className="af-card" style={{ borderTop: '4px solid var(--af-primary)' }}>
            <h2>Growth Plan</h2>
            <p className="af-muted">Perfect for solo practitioners and expanding accounting practices.</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '24px 0' }}>$99 <span style={{ fontSize: '14px', color: 'var(--af-text-muted)' }}>/ month</span></p>
            <button 
              className="af-btn af-btn-primary" 
              style={{ width: '100%' }} 
              disabled={isProcessing}
              onClick={() => handleSubscribe('price_GROWTH_123')}
            >
              Subscribe Now
            </button>
          </FadeIn>
        </div>
      )}
    </div>
  );
};

export default BillingPortal;