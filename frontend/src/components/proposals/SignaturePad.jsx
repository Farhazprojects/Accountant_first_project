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
      <div className="af-card mb-24">
        <h2 style={{ marginBottom: '8px' }}>Digital Signature</h2>
        <p className="af-muted" style={{ marginBottom: '16px', fontSize: '14px' }}>
          By signing below, you agree to the terms and services outlined in this proposal.
        </p>

        <div 
          style={{ 
            border: '2px dashed var(--af-border)', 
            borderRadius: 'var(--af-radius)', 
            backgroundColor: 'var(--af-bg)',
            marginBottom: '16px' 
          }}
        >
          <SignatureCanvas 
            ref={sigCanvas}
            penColor="var(--af-text-main)"
            canvasProps={{
              width: 500, 
              height: 200, 
              className: 'sigCanvas',
              style: { width: '100%', height: '200px', cursor: 'crosshair' }
            }} 
          />
        </div>

        {error && (
          <div className="mb-24" style={{ color: 'var(--af-danger)', fontSize: '14px', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button 
            type="button" 
            className="af-btn af-btn-outline" 
            onClick={handleClear}
          >
            Clear
          </button>
          {onCancel && (
            <button 
              type="button" 
              className="af-btn af-btn-secondary" 
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button 
            type="button" 
            className="af-btn af-btn-primary hover-lift" 
            onClick={handleAccept}
          >
            Sign & Accept
          </button>
        </div>
      </div>
    </FadeIn>
  );
};

export default SignaturePad;