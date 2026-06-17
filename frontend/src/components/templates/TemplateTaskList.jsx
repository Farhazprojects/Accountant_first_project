import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TemplateTaskItem from './TemplateTaskItem';

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
        // Using generic endpoint structure based on previous controllers
        const response = await axios.get(`http://localhost:5000/api/templates/${templateId}/tasks`);
        setTemplateTasks(response.data.data);
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
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;

    const newTasks = [...templateTasks];
    const draggedItemContent = newTasks.splice(dragItem.current, 1)[0];
    newTasks.splice(dragOverItem.current, 0, draggedItemContent);
    
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index
    }));

    setTemplateTasks(updatedTasks);
    dragItem.current = null;
    dragOverItem.current = null;

    try {
      const payload = updatedTasks.map(t => ({ id: t.id, order: t.order }));
      await axios.put(`http://localhost:5000/api/templates/${templateId}/tasks/reorder`, { tasks: payload });
    } catch (err) {
      console.error('Failed to save template task order:', err);
      setError('Failed to persist task ordering.');
    }
  };

  if (isLoading) return <div className="af-muted fade-in">Loading template blueprint...</div>;
  if (error) return <div className="af-status-pill af-btn-danger fade-in">{error}</div>;

  return (
    <div className="af-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Blueprint Tasks</h2>
        <button className="af-btn af-btn-primary hover-lift">
          + Add Template Task
        </button>
      </div>

      {templateTasks.length === 0 ? (
        <div className="af-card fade-in">No tasks defined for this template yet.</div>
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