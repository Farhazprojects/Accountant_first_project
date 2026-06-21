import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../api/axiosClient';
import TaskItem from './TaskItem';
import TaskActivityPanel from './TaskActivityPanel';
import { LoadingSkeleton, EmptyState } from '../ui/Skeletons';

export const TaskList = ({ workflowId, onTaskUpdated }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get(`/tasks/workflow/${workflowId}`);
        // Ensure we sort by order on the client side just in case
        const sortedTasks = (response.data.data || []).sort((a, b) => a.order - b.order);
        setTasks(sortedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (workflowId) {
      fetchTasks();
    }
  }, [workflowId]);

  const handleDragStart = (e, position) => {
    dragItem.current = position;
    // Add a ghost effect during drag
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === null || dragOverItem.current === null || dragItem.current === dragOverItem.current) {
      return;
    }

    const newTasks = [...tasks];
    const draggedItemContent = newTasks.splice(dragItem.current, 1)[0];
    newTasks.splice(dragOverItem.current, 0, draggedItemContent);

    // Update orders
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index,
    }));

    setTasks(updatedTasks);

    dragItem.current = null;
    dragOverItem.current = null;

    try {
      const payload = updatedTasks.map(t => ({ id: t.id, order: t.order }));
      await axiosClient.put('/tasks/reorder', { tasks: payload });
    } catch (err) {
      console.error('Failed to save new task order:', err);
      setError('Failed to save task order.');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  if (isLoading) return <LoadingSkeleton count={4} />;
  
  if (error) {
    return (
      <div className="af-card fade-in" style={{ borderColor: 'var(--af-danger)', backgroundColor: '#fff5f5' }}>
        <p style={{ color: 'var(--af-danger)', margin: 0 }}>{error}</p>
        <button className="af-btn af-btn-small af-btn-outline mt-12" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (tasks.length === 0) return <EmptyState message="This workflow doesn't have any tasks yet." />;

  return (
    <div className="af-dashboard fade-in">
      {selectedTask && (
        <TaskActivityPanel 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onTaskUpdated={(updatedTask) => {
            setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
            setSelectedTask(updatedTask);
            if (onTaskUpdated) onTaskUpdated(updatedTask);
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span className="af-muted" style={{ fontSize: '12px' }}>{tasks.length} TASKS TOTAL</span>
        <span className="af-muted" style={{ fontSize: '12px' }}>DRAG TO REORDER</span>
      </div>
      
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          onClick={handleTaskClick}
        />
      ))}
    </div>
  );
};

export default TaskList;
