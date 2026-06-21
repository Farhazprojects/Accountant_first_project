import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await axiosClient.get(`/tasks/${taskId}`);
        setTask(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  if (loading) return <div className="af-dashboard af-muted">Loading task details...</div>;

  if (error) {
    return (
      <div className="af-dashboard">
        <div className="af-card" style={{ borderColor: 'var(--af-danger)' }}>
          <p style={{ marginTop: 0, color: 'var(--af-danger)' }}>{error}</p>
          <button className="af-btn af-btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="af-dashboard">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0' }}>Task Details</h1>
        <p className="af-muted" style={{ margin: 0 }}>Track execution and status for this task.</p>
      </div>

      <div className="af-card">
        <div className="mb-24">
          <label className="af-label">TITLE</label>
          <div style={{ fontSize: '18px', fontWeight: '600' }}>{task?.title}</div>
        </div>
        <div className="mb-24">
          <label className="af-label">DESCRIPTION</label>
          <p className="af-muted" style={{ margin: 0 }}>{task?.description || 'No description provided.'}</p>
        </div>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label className="af-label">STATUS</label>
            <span className="af-status-pill">{(task?.status || 'pending').toUpperCase()}</span>
          </div>
          <div>
            <label className="af-label">DUE DATE</label>
            <span className="af-muted">{task?.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>
        <button className="af-btn af-btn-outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default TaskDetailPage;
