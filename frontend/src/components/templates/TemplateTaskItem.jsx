import React from 'react';
import FadeIn from '../ui/FadeIn';

export const TemplateTaskItem = ({ 
  templateTask, 
  index, 
  onDragStart, 
  onDragEnter, 
  onDragEnd 
}) => {
  return (
    <FadeIn delay={index * 50}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnter={(e) => onDragEnter(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        className="af-card hover-lift mb-24"
        style={{ 
          cursor: 'grab', 
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderLeft: '4px solid var(--af-primary)'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span 
              style={{ 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--af-secondary)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                color: 'var(--af-text-muted)'
              }}
            >
              {index + 1}
            </span>
            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600' }}>{templateTask.title}</h3>
          </div>
          
          {templateTask.description && (
            <p className="af-muted" style={{ margin: '0 0 16px 36px', fontSize: '14px', lineHeight: '1.5' }}>
              {templateTask.description}
            </p>
          )}
          
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginLeft: '36px' }}>
            <span 
              className="af-status-pill" 
              style={{ backgroundColor: 'var(--af-secondary)', color: 'var(--af-text-main)', fontSize: '11px' }}
            >
              ⏱️ {templateTask.daysToComplete || 0} DAYS
            </span>
            <span 
              className="af-status-pill"
              style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #dbeafe', fontSize: '11px' }}
            >
              👤 {templateTask.targetRole ? templateTask.targetRole.toUpperCase() : 'ANY STAFF'}
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="af-btn af-btn-small af-btn-outline">Edit</button>
          <button className="af-btn af-btn-small af-btn-danger" style={{ opacity: 0.8 }}>Remove</button>
          <div className="af-muted" style={{ fontSize: '20px', marginLeft: '8px', opacity: 0.3 }}>⋮</div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TemplateTaskItem;
