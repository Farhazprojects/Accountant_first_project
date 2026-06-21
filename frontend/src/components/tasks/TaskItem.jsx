import React from 'react';
import FadeIn from '../ui/FadeIn';

export const TaskItem = ({ 
  task, 
  index, 
  onDragStart, 
  onDragEnter, 
  onDragEnd,
  onClick
}) => {
  // Use af-status-pill naming convention from design system
  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed': 
        return { backgroundColor: '#dcfce7', color: '#166534', border: '1px solid #bbf7d0' };
      case 'in_progress': 
        return { backgroundColor: '#dbeafe', color: '#1e40af', border: '1px solid #bfdbfe' };
      default: 
        return { backgroundColor: 'var(--af-secondary)', color: 'var(--af-text-muted)', border: '1px solid var(--af-border)' };
    }
  };

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
    : 'No due date';

  const statusLabel = task.status ? task.status.replace('_', ' ').toUpperCase() : 'PENDING';

  return (
    <FadeIn delay={index * 50}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, index)}
        onDragEnter={(e) => onDragEnter(e, index)}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => onClick && onClick(task)}
        className="af-card hover-lift mb-24"
        style={{ 
          cursor: 'grab', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{task.title}</h3>
            <span 
              className="af-status-pill" 
              style={{ ...getStatusStyle(task.status), fontSize: '10px', padding: '2px 8px' }}
            >
              {statusLabel}
            </span>
          </div>
          
          {task.description && (
            <p className="af-muted" style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.5' }}>
              {task.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px' }}>📅</span>
              <span className="af-muted" style={{ fontSize: '12px' }}>{formattedDate}</span>
            </div>
            {task.assignee && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--af-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                >
                  {task.assignee.firstName?.[0]}{task.assignee.lastName?.[0]}
                </div>
                <span className="af-muted" style={{ fontSize: '12px' }}>
                  {task.assignee.firstName} {task.assignee.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {!task.assigneeId && (
            <button 
              className="af-btn af-btn-small af-btn-outline"
              onClick={(e) => { e.stopPropagation(); /* assignment logic */ }}
            >
              Assign
            </button>
          )}
          <div className="af-muted" style={{ fontSize: '20px', opacity: 0.3 }}>⋮</div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TaskItem;
