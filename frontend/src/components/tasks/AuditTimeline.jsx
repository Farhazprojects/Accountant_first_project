import React from 'react';

export const AuditTimeline = ({ taskId }) => {
  // Mock data for the timeline (to be replaced with actual API data)
  const activities = [
    { id: 1, action: 'Task Created', user: 'Admin Account', date: '2 hours ago' },
    { id: 2, action: 'Assigned to Jane Staff', user: 'Admin Account', date: '1 hour ago' },
    { id: 3, action: 'Status changed to In Progress', user: 'Jane Staff', date: '15 mins ago' },
  ];

  return (
    <div className="fade-in">
      {activities.map((activity, index) => (
        <div key={activity.id} style={{ display: 'flex', gap: '16px', marginBottom: '20px', position: 'relative' }}>
          {/* Connector Line */}
          {index !== activities.length - 1 && (
            <div 
              style={{ 
                position: 'absolute', 
                left: '7px', 
                top: '20px', 
                bottom: '-20px', 
                width: '1px', 
                backgroundColor: 'var(--af-border)' 
              }} 
            />
          )}
          
          {/* Bullet */}
          <div 
            style={{ 
              width: '15px', 
              height: '15px', 
              borderRadius: '50%', 
              backgroundColor: index === 0 ? 'var(--af-primary)' : 'var(--af-secondary)',
              border: '2px solid #fff',
              zIndex: 1,
              marginTop: '4px'
            }} 
          />

          <div>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{activity.action}</div>
            <div className="af-muted" style={{ fontSize: '12px' }}>
              {activity.user} • {activity.date}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuditTimeline;
