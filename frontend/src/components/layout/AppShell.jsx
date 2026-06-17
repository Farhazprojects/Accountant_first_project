import React from 'react';
import Sidebar from './Sidebar';

export const AppShell = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--af-bg)' }}>
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Dynamic Main Content Canvas */}
      <main 
        style={{ 
          flexGrow: 1, 
          marginLeft: '260px', // Matches sidebar width
          padding: '40px',
          maxWidth: '1200px',
          width: 'calc(100% - 260px)',
          overflowY: 'auto'
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AppShell;