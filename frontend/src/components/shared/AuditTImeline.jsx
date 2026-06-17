import React from 'react';
import FadeIn from '../ui/FadeIn';

export const AuditTimeline = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <div className="af-card">
        <p className="af-muted" style={{ margin: 0 }}>No activity logged yet.</p>
      </div>
    );
  }

  return (
    <div className="af-card">
      <h3 style={{ marginTop: 0, marginBottom: '24px' }}>Activity Log</h3>
      <div style={{ position: 'relative', paddingLeft: '16px' }}>
        {/* Vertical Line */}
        <div 
          style={{ 
            position: 'absolute', 
            left: '4px', 
            top: '8px', 
            bottom: '8px', 
            width: '2px', 
            backgroundColor: 'var(--af-border)' 
          }} 
        />
        
        {logs.map((log, index) => (
          <FadeIn key={log.id || index} delay={index * 50}>
            <div style={{ position: 'relative', marginBottom: index === logs.length - 1 ? '0' : '24px' }}>
              {/* Timeline Dot */}
              <div 
                style={{ 
                  position: 'absolute', 
                  left: '-16px', 
                  top: '4px', 
                  width: '10px', 
                  height: '10px', 
                  borderRadius: '50%', 
                  backgroundColor: 'var(--af-primary)',
                  border: '2px solid var(--af-card-bg)'
                }} 
              />
              
              <div style={{ paddingLeft: '16px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500', color: 'var(--af-text-main)' }}>
                  {log.action}
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="af-muted" style={{ fontSize: '12px' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                  {log.user && (
                    <>
                      <span className="af-muted" style={{ fontSize: '12px' }}>•</span>
                      <span className="af-muted" style={{ fontSize: '12px' }}>{log.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
};

export default AuditTimeline;