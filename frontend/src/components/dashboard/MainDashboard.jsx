import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import FadeIn from '../ui/FadeIn';

export const MainDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({ activeWorkflows: 0, pendingProposals: 0 });
  const [myTasks, setMyTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [workflowsRes, myTasksRes] = await Promise.all([
          axiosClient.get('/workflows'),
          axiosClient.get('/tasks/my'),
        ]);

        const workflows = workflowsRes.data.data || [];
        const tasks = myTasksRes.data.data || [];

        setMetrics({
          activeWorkflows: workflows.length,
          pendingProposals: 0,
        });
        setMyTasks(tasks);
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        setMetrics({ activeWorkflows: 0, pendingProposals: 0 });
        setMyTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) return <div className="af-dashboard af-muted">Loading your workspace...</div>;

  return (
    <div className="af-dashboard">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ margin: '0 0 8px 0' }}>Welcome back, {user?.firstName || 'Accountant'}</h1>
        <p className="af-muted" style={{ margin: 0 }}>Here is what is happening in your firm today.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <FadeIn className="af-card hover-lift" delay={0}>
          <h3 className="af-muted" style={{ margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase' }}>Active Workflows</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: 'var(--af-primary)' }}>{metrics.activeWorkflows}</p>
        </FadeIn>

        <FadeIn className="af-card hover-lift" delay={50}>
          <h3 className="af-muted" style={{ margin: '0 0 8px 0', fontSize: '14px', textTransform: 'uppercase' }}>Pending Proposals</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: 'var(--af-secondary)' }}>{metrics.pendingProposals}</p>
        </FadeIn>
      </div>

      <FadeIn className="af-card" delay={100} style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--af-border)', backgroundColor: 'var(--af-bg)' }}>
          <h2 style={{ margin: 0, fontSize: '18px' }}>My Priorities</h2>
        </div>

        {myTasks.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center' }} className="af-muted">You have no assigned tasks. Great job!</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <tbody>
              {myTasks.map((task) => (
                <tr key={task.id} style={{ borderBottom: '1px solid var(--af-border)' }}>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: '500' }}>{task.title}</p>
                    <p className="af-muted" style={{ margin: 0, fontSize: '12px' }}>{task.workflow?.name || task.workflowName || 'Assigned Task'}</p>
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className="af-muted" style={{ fontSize: '14px' }}>
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      className="af-btn af-btn-small af-btn-outline"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      Open Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </FadeIn>
    </div>
  );
};

export default MainDashboard;