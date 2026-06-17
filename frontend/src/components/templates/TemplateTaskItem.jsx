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
        style={{ cursor: 'grab', padding: '16px 24px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="af-muted" style={{ fontWeight: 'bold', fontSize: '14px' }}>
                {index + 1}.
              </span>
              <h3 style={{ margin: 0, fontSize: '16px' }}>{templateTask.title}</h3>
            </div>
            
            {templateTask.description && (
              <p className="af-muted" style={{ margin: '0 0 12px 24px', fontSize: '14px' }}>
                {templateTask.description}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginLeft: '24px' }}>
              <span className="af-status-pill af-btn-secondary">
                +{templateTask.daysToComplete || 0} Days to Complete
              </span>
              <span className="af-muted" style={{ fontSize: '12px' }}>
                Auto-assign: {templateTask.targetRole ? templateTask.targetRole.toUpperCase() : 'Unassigned'}
              </span>
            </div>
          </div>
          
          <div>
            <button className="af-btn af-btn-small af-btn-outline" style={{ marginRight: '8px' }}>
              Edit
            </button>
            <button className="af-btn af-btn-small af-btn-danger">
              Remove
            </button>
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TemplateTaskItem;