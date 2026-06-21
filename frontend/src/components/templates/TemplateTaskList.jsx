import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import TemplateTaskItem from './TemplateTaskItem';
import { LoadingSkeleton, EmptyState } from '../ui/Skeletons';

export const TemplateTaskList = ({ templateId }) => {
  const [templateTasks, setTemplateTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    const fetchTemplateTasks = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/templates/${templateId}/tasks`);
        const sorted = (response.data.data || []).sort((a, b) => a.order - b.order);
        setTemplateTasks(sorted);
      } catch (err) {
        console.error('Failed to fetch template tasks:', err);
        setError('Failed to load blueprint tasks.');
      } finally {
        setIsLoading(false);
      }
    };

    if (templateId) {
      fetchTemplateTasks();
    }
  }, [templateId]);

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      return;
    }

    const newTasks = [...templateTasks];
    const draggedItemContent = newTasks.splice(dragItem.current, 1)[0];
    newTasks.splice(dragOverItem.current, 0, draggedItemContent);

    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTemplateTasks(updatedTasks);
    dragItem.current = null;
    dragOverItem.current = null;

    try {
      const payload = updatedTasks.map(t => ({ id: t.id, order: t.order }));
      await axiosClient.put(`/templates/${templateId}/tasks/reorder`, { tasks: payload });
    } catch (err) {
      console.error('Failed to save template task order:', err);
      setError('Failed to persist task ordering.');
    }
  };

  if (isLoading) return <LoadingSkeleton count={3} />;

  return (
    <div className="af-dashboard fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>Workflow Blueprint</h2>
          <p className="af-muted" style={{ margin: 0, fontSize: '14px' }}>Define the recurring task sequence for this template.</p>
        </div>
        <button className="af-btn af-btn-primary hover-lift">
          + Add Template Task
        </button>
      </div>

      {error && (
        <div className="af-card mb-24" style={{ borderColor: 'var(--af-danger)', color: 'var(--af-danger)' }}>
          {error}
        </div>
      )}

      {templateTasks.length === 0 ? (
        <EmptyState message="No tasks defined for this template yet. Build your blueprint to automate client onboarding." />
      ) : (
        templateTasks.map((task, index) => (
          <TemplateTaskItem
            key={task.id}
            templateTask={task}
            index={index}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragEnd={handleDragEnd}
          />
        ))
      )}
    </div>
  );
};

export default TemplateTaskList;
