import React from 'react';
import FadeIn from '../ui/FadeIn';

export const TaskItem = ({ 
  task, 
  index, 
  onDragStart, 
  onDragEnter, 
  onDragEnd 
}) => {
  // Determine status pill colors based on task status
  const getStatusClass = (status) => {
    switch (status) {
      case 'completed': return 'af-btn-primary'; // Borrowing lime green for completed
      case 'in_progress': return 'af-btn-secondary';
      default: return 'af-btn-outline';
    }
  };

  const formattedDate = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString() 
    : 'No due date';

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
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{task.title}</h3>
            {task.description && (
              <p className="af-muted" style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                {task.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className={`af-status-pill ${getStatusClass(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
              <span className="af-muted" style={{ fontSize: '12px' }}>
                Due: {formattedDate}
              </span>
            </div>
          </div>
          
          <div>
            {/* Task Assignment Badge Placeholder */}
            {task.assigneeId ? (
              <div className="af-status-pill" style={{ backgroundColor: 'var(--af-primary)', color: '#fff' }}>
                Assigned
              </div>
            ) : (
              <button className="af-btn af-btn-small af-btn-outline">Assign</button>
            )}
          </div>
        </div>
      </div>
    </FadeIn>
  );
};

export default TaskItem;