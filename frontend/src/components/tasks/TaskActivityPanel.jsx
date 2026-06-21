import React, { useState } from 'react';
import axiosClient from '../../api/axiosClient';
import AuditTimeline from './AuditTimeline';

export const TaskActivityPanel = ({ task, onClose, onTaskUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!task) return null;

  const handleComplete = async () => {
    try {
      setIsUpdating(true);
      const response = await axiosClient.put(`/tasks/${task.id}`, { status: 'completed' });
      if (onTaskUpdated) {
        onTaskUpdated(response.data.data);
      }
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div 
      className="af-card fade-in" 
      style={{ 
        position: 'fixed', 
        top: '0', 
        right: '0', 
        width: '400px', 
        height: '100vh', 
        zIndex: 1100,
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', margin: 0 }}>Task Details</h2>
        <button onClick={onClose} className="af-btn af-btn-small af-btn-secondary">Close</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div className="mb-24">
          <label className="af-label">TITLE</label>
          <div style={{ fontSize: '16px', fontWeight: '600' }}>{task.title}</div>
        </div>

        <div className="mb-24">
          <label className="af-label">DESCRIPTION</label>
          <p className="af-muted" style={{ margin: 0 }}>{task.description || 'No description provided.'}</p>
        </div>

        <div className="mb-24" style={{ display: 'flex', gap: '24px' }}>
          <div>
            <label className="af-label">STATUS</label>
            <span className="af-status-pill">{task.status.toUpperCase()}</span>
          </div>
          <div>
            <label className="af-label">DUE DATE</label>
            <span className="af-muted">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid var(--af-border)', margin: '32px 0' }} />

        <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--af-text-muted)' }}>ACTIVITY LOG</h3>
        <AuditTimeline taskId={task.id} />
      </div>

      <div style={{ paddingTop: '24px', borderTop: '1px solid var(--af-border)' }}>
        {task.status !== 'completed' && (
          <button 
            className="af-btn af-btn-primary" 
            style={{ width: '100%' }}
            onClick={handleComplete}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Mark as Completed'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskActivityPanel;
