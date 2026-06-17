import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import SignaturePad from './SignaturePad';
import FadeIn from '../ui/FadeIn';

export const ProposalViewer = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/proposals/${proposalId}`);
        setProposal(response.data.data);
      } catch (error) {
        console.error('Failed to load proposal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposal();
  }, [proposalId]);

  const handleSignatureAccept = async (base64Signature) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/proposals/${proposalId}/accept`, {
        signatureData: base64Signature
      });
      
      setProposal(prev => ({ ...prev, status: 'accepted', signedDocumentUrl: response.data.data.documentUrl }));
      setSuccessMessage('Thank you! Your proposal has been legally signed and accepted.');
    } catch (error) {
      alert('Failed to submit signature. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="af-page" style={{ padding: '40px', textAlign: 'center' }}>Loading Proposal...</div>;
  if (!proposal) return <div className="af-page" style={{ padding: '40px', textAlign: 'center', color: 'var(--af-danger)' }}>Proposal not found or has expired.</div>;

  return (
    <div className="af-page" style={{ backgroundColor: 'var(--af-secondary)', minHeight: '100vh', padding: '40px 20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Proposal Document UI */}
        <FadeIn className="af-card mb-24" style={{ padding: '40px', minHeight: '500px' }}>
          <div style={{ borderBottom: '2px solid var(--af-border)', paddingBottom: '24px', marginBottom: '24px' }}>
            <h1 style={{ margin: '0 0 8px 0' }}>{proposal.title}</h1>
            <p className="af-muted" style={{ margin: 0 }}>Prepared for: <strong>{proposal.client?.name || 'Client'}</strong></p>
          </div>
          
          <div style={{ marginBottom: '40px', lineHeight: '1.6' }}>
            <h3>Scope of Work</h3>
            <p>This document outlines the accounting, bookkeeping, and tax services to be provided for the upcoming financial year...</p>
            {/* In a real app, you might render compiled HTML from your database here */}
            
            <h3 style={{ marginTop: '24px' }}>Investment</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--af-primary)' }}>
              ${parseFloat(proposal.totalAmount).toFixed(2)} <span style={{ fontSize: '16px', color: 'var(--af-muted)' }}>/ month</span>
            </p>
          </div>
        </FadeIn>

        {/* Acceptance & Signature Area */}
        {successMessage || proposal.status === 'accepted' ? (
          <FadeIn className="af-card" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <h2 style={{ color: '#166534', margin: '0 0 16px 0' }}>{successMessage || 'This proposal has already been accepted.'}</h2>
            {proposal.signedDocumentUrl && (
              <a href={proposal.signedDocumentUrl} target="_blank" rel="noreferrer" className="af-btn af-btn-primary">
                Download Signed PDF
              </a>
            )}
          </FadeIn>
        ) : (
          <div style={{ opacity: isSubmitting ? 0.5 : 1, pointerEvents: isSubmitting ? 'none' : 'auto' }}>
            <SignaturePad onSign={handleSignatureAccept} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProposalViewer;