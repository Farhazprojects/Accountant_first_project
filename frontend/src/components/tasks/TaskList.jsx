import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import TaskItem from './TaskItem';

export const TaskList = ({ workflowId }) => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dragItem = useRef();
  const dragOverItem = useRef();

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        // Assuming API is running on localhost:5000 as configured in Step 3
        const response = await axios.get(`http://localhost:5000/api/tasks/workflow/${workflowId}`);
        setTasks(response.data.data);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [workflowId]);

  const handleDragStart = (e, position) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    if (dragItem.current === undefined || dragOverItem.current === undefined) return;

    // Create a deep copy of the tasks array
    const newTasks = [...tasks];
    
    // Remove the dragged item and insert it at the new position
    const draggedItemContent = newTasks.splice(dragItem.current, 1)[0];
    newTasks.splice(dragOverItem.current, 0, draggedItemContent);
    
    // Update the 'order' property based on new array index
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      order: index
    }));

    // Optimistically update the UI
    setTasks(updatedTasks);
    
    dragItem.current = null;
    dragOverItem.current = null;

    // Persist new order to the backend
    try {
      const payload = updatedTasks.map(t => ({ id: t.id, order: t.order }));
      await axios.put('http://localhost:5000/api/tasks/reorder', { tasks: payload });
    } catch (err) {
      console.error('Failed to save new task order:', err);
      // Optional: Revert state here if API call fails
      setError('Failed to save task order.');
    }
  };

  if (isLoading) return <div className="af-muted fade-in">Loading tasks... (Skeleton incoming)</div>;
  if (error) return <div className="af-status-pill af-btn-danger fade-in">{error}</div>;
  if (tasks.length === 0) return <div className="af-card fade-in">No tasks found. Create one to get started.</div>;

  return (
    <div className="af-dashboard">
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};

export default TaskList;