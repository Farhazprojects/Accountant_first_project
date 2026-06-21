import React from 'react';

export const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="af-dashboard">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="af-card mb-24 fade-in" 
          style={{ height: '100px', opacity: 0.5, borderStyle: 'dashed' }}
        >
          <div style={{ width: '40%', height: '16px', background: 'var(--af-secondary)', marginBottom: '12px', borderRadius: '4px' }}></div>
          <div style={{ width: '80%', height: '12px', background: 'var(--af-secondary)', borderRadius: '4px' }}></div>
        </div>
      ))}
    </div>
  );
};

export const EmptyState = ({ message = 'No items found.' }) => {
  return (
    <div className="af-card fade-in" style={{ textAlign: 'center', padding: '64px 24px', borderStyle: 'dashed' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
      <h3 className="af-text-main" style={{ margin: '0 0 8px 0' }}>Empty Workspace</h3>
      <p className="af-muted" style={{ margin: 0 }}>{message}</p>
    </div>
  );
};

function Skeletons({ type = 'list', count = 3 }) {
  if (type === 'detail') {
    return (
      <div className="af-dashboard">
        <div className="af-card mb-24 fade-in" style={{ opacity: 0.5, borderStyle: 'dashed' }}>
          <div style={{ width: '60%', height: '24px', background: 'var(--af-secondary)', marginBottom: '12px', borderRadius: '4px' }}></div>
          <div style={{ width: '40%', height: '16px', background: 'var(--af-secondary)', marginBottom: '8px', borderRadius: '4px' }}></div>
          <div style={{ width: '80%', height: '16px', background: 'var(--af-secondary)', marginBottom: '8px', borderRadius: '4px' }}></div>
          <div style={{ width: '30%', height: '16px', background: 'var(--af-secondary)', borderRadius: '4px' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="af-dashboard">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="af-card mb-24 fade-in" 
          style={{ height: '100px', opacity: 0.5, borderStyle: 'dashed' }}
        >
          <div style={{ width: '40%', height: '16px', background: 'var(--af-secondary)', marginBottom: '12px', borderRadius: '4px' }}></div>
          <div style={{ width: '80%', height: '12px', background: 'var(--af-secondary)', borderRadius: '4px' }}></div>
        </div>
      ))}
    </div>
  );
}

export { Skeletons };
export default Skeletons;