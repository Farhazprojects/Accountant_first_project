import React from 'react';
import FadeIn from '../ui/FadeIn';

export const WorkflowSidebar = ({ workflow, totalTasks, completedTasks }) => {
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return { bg: '#dcfce7', text: '#166534' };
      case 'active': return { bg: '#dbeafe', text: '#1e40af' };
      default: return { bg: 'var(--af-secondary)', text: 'var(--af-text-muted)' };
    }
  };

  const statusStyle = getStatusColor(workflow.status);

  return (
    <FadeIn delay={100}>
      <div className="af-card mb-24" style={{ position: 'sticky', top: '24px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Workflow Progress</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <label className="af-label" style={{ fontSize: '11px', color: 'var(--af-text-muted)' }}>CURRENT STATUS</label>
          <div 
            className="af-status-pill" 
            style={{ 
              backgroundColor: statusStyle.bg, 
              color: statusStyle.text,
              padding: '6px 12px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            {workflow.status ? workflow.status.toUpperCase() : 'ACTIVE'}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label className="af-label" style={{ fontSize: '11px', color: 'var(--af-text-muted)' }}>RECURRENCE</label>
          <p className="af-text-main" style={{ margin: 0, fontWeight: '500', textTransform: 'capitalize' }}>
            {workflow.recurrenceRule || 'One-time Task'}
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'baseline' }}>
            <label className="af-label" style={{ fontSize: '11px', color: 'var(--af-text-muted)', margin: 0 }}>COMPLETION</label>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--af-primary)' }}>
              {progressPercentage}%
            </span>
          </div>
          
          <div style={{ width: '100%', backgroundColor: 'var(--af-secondary)', borderRadius: '9999px', height: '10px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                backgroundColor: 'var(--af-primary)', 
                width: `${progressPercentage}%`,
                transition: 'width 0.6s cubic-bezier(0.65, 0, 0.35, 1)'
              }} 
            />
          </div>
          <p className="af-muted" style={{ fontSize: '13px', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Tasks Finished</span>
            <strong>{completedTasks} / {totalTasks}</strong>
          </p>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid var(--af-border)', margin: '24px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            className="af-btn af-btn-outline" 
            style={{ width: '100%', justifyContent: 'flex-start', fontSize: '13px' }}
            disabled={progressPercentage < 100}
          >
            🏁 Finalize Workflow
          </button>
          <button className="af-btn af-btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '13px' }}>
            ⚙️ Workflow Settings
          </button>
        </div>
      </div>
    </FadeIn>
  );
};

export default WorkflowSidebar;
