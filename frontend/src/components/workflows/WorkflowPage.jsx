import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import TaskList from '../tasks/TaskList';
import WorkflowSidebar from './WorkflowSidebar';
import AfCard from '../ui/AfCard';
import AfButton from '../ui/AfButton';
import Skeletons from '../ui/Skeletons';
import FadeIn from '../ui/FadeIn';

export const WorkflowPage = () => {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/workflows');
      const data = response.data.data || [];
      setWorkflows(data);
      if (data.length > 0) {
        setSelectedWorkflow(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
      setError('Failed to load workflows.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    // Dynamically update the selected workflow's task list in state to update the progress bar
    setWorkflows(prevWorkflows =>
      prevWorkflows.map(w => {
        if (w.id === updatedTask.workflowId) {
          const updatedTasks = (w.tasks || []).map(t =>
            t.id === updatedTask.id ? updatedTask : t
          );
          const updatedW = { ...w, tasks: updatedTasks };
          if (selectedWorkflow && selectedWorkflow.id === w.id) {
            setSelectedWorkflow(updatedW);
          }
          return updatedW;
        }
        return w;
      })
    );
  };

  if (loading) return <Skeletons type="dashboard" />;

  if (error) {
    return (
      <div className="af-card fade-in" style={{ borderColor: 'var(--af-danger)', backgroundColor: '#fff5f5' }}>
        <p style={{ color: 'var(--af-danger)', margin: 0 }}>{error}</p>
        <AfButton variant="outline" className="mt-12" onClick={fetchWorkflows}>Retry</AfButton>
      </div>
    );
  }

  return (
    <div className="af-dashboard fade-in">
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Workflows</h1>
        <p className="af-muted" style={{ margin: '4px 0 0 0' }}>Track operational progress and task compliance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', alignItems: 'start' }}>
        {/* Left Side: Workflows Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>Active Runs</h2>
          {workflows.length === 0 ? (
            <p className="af-muted">No active workflows found.</p>
          ) : (
            workflows.map((w, idx) => {
              const total = w.tasks?.length || 0;
              const completed = w.tasks?.filter(t => t.status === 'completed').length || 0;
              const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
              const isSelected = selectedWorkflow && selectedWorkflow.id === w.id;

              return (
                <FadeIn key={w.id} delay={idx * 50}>
                  <div
                    onClick={() => setSelectedWorkflow(w)}
                    className="af-card hover-lift"
                    style={{
                      cursor: 'pointer',
                      padding: '16px 20px',
                      borderColor: isSelected ? 'var(--af-primary)' : 'var(--af-border)',
                      borderWidth: isSelected ? '2px' : '1px',
                      backgroundColor: isSelected ? 'var(--af-card-bg)' : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>{w.name}</h4>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--af-primary)' }}>{pct}%</span>
                    </div>
                    
                    <div style={{ width: '100%', backgroundColor: 'var(--af-secondary)', borderRadius: '9999px', height: '6px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          backgroundColor: 'var(--af-primary)', 
                          width: `${pct}%`,
                          transition: 'width 0.4s ease'
                        }} 
                      />
                    </div>
                    <p className="af-muted" style={{ fontSize: '11px', margin: '8px 0 0 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ textTransform: 'capitalize' }}>{w.recurrenceRule || 'One-time'}</span>
                      <span>{completed}/{total} tasks</span>
                    </p>
                  </div>
                </FadeIn>
              );
            })
          )}
        </div>

        {/* Right Side: Selected Workflow Workspace */}
        {selectedWorkflow ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
            {/* Center: Tasks List */}
            <div>
              <h2 style={{ fontSize: '20px', margin: '0 0 16px 0' }}>{selectedWorkflow.name} Tasks</h2>
              <TaskList 
                workflowId={selectedWorkflow.id} 
                onTaskUpdated={handleTaskUpdated} 
              />
            </div>

            {/* Right Side: Metrics/Actions Sidebar */}
            <WorkflowSidebar
              workflow={selectedWorkflow}
              totalTasks={selectedWorkflow.tasks?.length || 0}
              completedTasks={selectedWorkflow.tasks?.filter(t => t.status === 'completed').length || 0}
            />
          </div>
        ) : (
          <div className="af-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <p className="af-muted">Select a workflow from the list to view its tasks.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowPage;
