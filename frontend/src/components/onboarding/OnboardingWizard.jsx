import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import FadeIn from '../ui/FadeIn';

export const OnboardingWizard = () => {
  const [step, setStep] = useState(1);
  const [clientId, setClientId] = useState('new');
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    services: {
      bookkeeping: false,
      payroll: false,
      tax: false,
    }
  });

  // Ref to hold the auto-save timer
  const autoSaveTimer = useRef(null);

  // Auto-progress saving logic (Debounced)
  useEffect(() => {
    // Don't auto-save if the required name is empty
    if (!formData.name) return;

    setIsSaving(true);
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(async () => {
      try {
        const response = await axios.put(`http://localhost:5000/api/onboarding/${clientId}`, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          onboardingStep: step
        });

        // If it was a new client, update the ID so subsequent saves update the record
        if (clientId === 'new') {
          setClientId(response.data.data.client.id);
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1 second debounce

    return () => clearTimeout(autoSaveTimer.current);
  }, [formData, step, clientId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      services: { ...prev.services, [name]: checked } 
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="af-dashboard" style={{ maxWidth: '600px', margin: '0 auto' }}>
      
      {/* Step Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span className="af-muted" style={{ fontSize: '14px', fontWeight: '500' }}>
          Step {step} of 3
        </span>
        <span className="af-muted" style={{ fontSize: '14px', fontStyle: 'italic' }}>
          {isSaving ? 'Saving...' : 'All progress saved.'}
        </span>
      </div>

      <FadeIn key={step} className="af-card">
        {step === 1 && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Basic Details</h2>
            <div className="mb-24">
              <label className="af-label">Client / Company Name *</label>
              <input 
                type="text" 
                name="name" 
                className="af-input" 
                value={formData.name} 
                onChange={handleInputChange} 
                placeholder="Acme Corp" 
              />
            </div>
            <div className="mb-24">
              <label className="af-label">Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="af-input" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="contact@acmecorp.com" 
              />
            </div>
            <div className="mb-24">
              <label className="af-label">Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                className="af-input" 
                value={formData.phone} 
                onChange={handleInputChange} 
                placeholder="(555) 123-4567" 
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>Select Services</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="bookkeeping" 
                  className="af-checkbox" 
                  checked={formData.services.bookkeeping} 
                  onChange={handleCheckboxChange} 
                />
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Monthly Bookkeeping</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="payroll" 
                  className="af-checkbox" 
                  checked={formData.services.payroll} 
                  onChange={handleCheckboxChange} 
                />
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Payroll Processing</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  name="tax" 
                  className="af-checkbox" 
                  checked={formData.services.tax} 
                  onChange={handleCheckboxChange} 
                />
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Annual Tax Return</span>
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Review & Generate Proposal</h2>
            <p className="af-muted mb-24">Review the client details below before sending the proposal.</p>
            
            <div style={{ backgroundColor: 'var(--af-bg)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
              <p style={{ margin: '0 0 8px 0' }}><strong>Name:</strong> {formData.name || 'N/A'}</p>
              <p style={{ margin: '0 0 8px 0' }}><strong>Email:</strong> {formData.email || 'N/A'}</p>
              <p style={{ margin: '0' }}><strong>Services:</strong> {
                Object.entries(formData.services)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([service]) => service.charAt(0).toUpperCase() + service.slice(1))
                  .join(', ') || 'None selected'
              }</p>
            </div>
          </div>
        )}

        <hr style={{ border: 'none', borderTop: '1px solid var(--af-border)', margin: '24px 0' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            className="af-btn af-btn-outline" 
            onClick={prevStep} 
            disabled={step === 1}
            style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button 
              type="button" 
              className="af-btn af-btn-primary hover-lift" 
              onClick={nextStep}
              disabled={!formData.name}
            >
              Next Step
            </button>
          ) : (
            <button 
              type="button" 
              className="af-btn af-btn-primary hover-lift" 
              onClick={() => alert('Proposal generated and sent!')}
            >
              Send Proposal
            </button>
          )}
        </div>
      </FadeIn>
    </div>
  );
};

export default OnboardingWizard;