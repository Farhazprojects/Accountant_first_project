import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import FadeIn from '../ui/FadeIn';

export const SignaturePad = ({ onSign, onCancel }) => {
  const sigCanvas = useRef(null);
  const [error, setError] = useState(null);

  const handleClear = () => {
    sigCanvas.current.clear();
    setError(null);
  };

  const handleAccept = () => {
    if (sigCanvas.current.isEmpty()) {
      setError('Please provide a signature before accepting.');
      return;
    }

    // Extracts the signature as a base64 encoded PNG
    const signatureBase64 = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
    onSign(signatureBase64);
  };

  return (
    <FadeIn>
      <div className="af-card fade-in" style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '12px', fontSize: '20px' }}>Legal Authorization</h2>
        <p className="af-muted" style={{ marginBottom: '24px', fontSize: '14px', lineHeight: '1.5' }}>
          By providing your digital signature below, you certify that you have read, understood, 
          and agree to be bound by the terms and conditions outlined in this service proposal.
        </p>

        <div 
          style={{ 
            border: '1px solid var(--af-border)', 
            borderRadius: 'var(--af-radius)', 
            backgroundColor: 'var(--af-bg)',
            marginBottom: '24px',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <SignatureCanvas 
            ref={sigCanvas}
            penColor="#0f172a"
            canvasProps={{
              width: 600, 
              height: 200, 
              className: 'sigCanvas',
              style: { width: '100%', height: '200px', cursor: 'crosshair' }
            }} 
          />
        </div>

        {error && (
          <div 
            className="mb-24" 
            style={{ 
              color: 'var(--af-danger)', 
              fontSize: '14px', 
              fontWeight: '500', 
              padding: '12px', 
              backgroundColor: '#fef2f2', 
              borderRadius: '8px',
              border: '1px solid #fee2e2'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', alignItems: 'center' }}>
          <button 
            type="button" 
            className="af-btn af-btn-outline" 
            onClick={handleClear}
            style={{ fontSize: '13px' }}
          >
            Clear Canvas
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="af-btn af-btn-secondary" 
              onClick={onCancel}
              style={{ fontSize: '13px' }}
            >
              Cancel
            </button>
          )}
          <button 
            type="button" 
            className="af-btn af-btn-primary hover-lift" 
            onClick={handleAccept}
            style={{ padding: '12px 32px' }}
          >
            Accept & Sign Proposal
          </button>
        </div>
      </div>
    </FadeIn>
  );
};

export default SignaturePad;
