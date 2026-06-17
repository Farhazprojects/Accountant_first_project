import React from 'react';
import FadeIn from '../ui/FadeIn';

export const WorkflowSidebar = ({ workflow, totalTasks, completedTasks }) => {
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <FadeIn delay={100}>
      <div className="af-card mb-24">
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Workflow Details</h3>
        
        <div style={{ marginBottom: '24px' }}>
          <span className="af-label">Status</span>
          <span className={`af-status-pill ${workflow.status === 'completed' ? 'af-btn-primary' : 'af-btn-secondary'}`}>
            {workflow.status ? workflow.status.toUpperCase() : 'ACTIVE'}
          </span>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <span className="af-label">Recurrence</span>
          <p className="af-muted" style={{ margin: 0, textTransform: 'capitalize' }}>
            {workflow.recurrenceRule || 'None'}
          </p>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span className="af-label" style={{ margin: 0 }}>Progress</span>
            <span className="af-muted" style={{ fontSize: '14px', fontWeight: '500' }}>
              {progressPercentage}%
            </span>
          </div>
          
          {/* Progress Bar UI */}
          <div style={{ width: '100%', backgroundColor: 'var(--af-secondary)', borderRadius: '9999px', height: '8px', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                backgroundColor: 'var(--af-primary)', 
                width: `${progressPercentage}%`,
                transition: 'width 0.4s ease-in-out'
              }} 
            />
          </div>
          <p className="af-muted" style={{ fontSize: '12px', marginTop: '8px' }}>
            {completedTasks} of {totalTasks} tasks completed
          </p>
        </div>
      </div>
    </FadeIn>
  );
};

export default WorkflowSidebar;