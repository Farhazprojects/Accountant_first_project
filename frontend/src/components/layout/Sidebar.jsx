import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();

  // Active style helper for React Router Links
  const getLinkStyle = ({ isActive }) => ({
    display: 'block',
    padding: '12px 16px',
    color: isActive ? 'var(--af-primary)' : 'var(--af-text-muted)',
    backgroundColor: isActive ? 'var(--af-bg)' : 'transparent',
    borderRadius: '6px',
    fontWeight: isActive ? '600' : '500',
    textDecoration: 'none',
    marginBottom: '8px',
    transition: 'all 0.2s ease'
  });

  return (
    <div 
      style={{ 
        width: '260px', 
        height: '100vh', 
        backgroundColor: 'var(--af-card-bg)', 
        borderRight: '1px solid var(--af-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'fixed',
        left: 0,
        top: 0
      }}
    >
      {/* Top Section: Branding & Links */}
      <div style={{ padding: '24px 16px' }}>
        <div style={{ marginBottom: '32px', paddingLeft: '8px' }}>
          <h2 style={{ margin: 0, color: 'var(--af-text-main)', fontSize: '20px' }}>Accountant First</h2>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--af-primary)', trackingSpacing: '1px' }}>WORKSPACE</span>
        </div>

        <nav>
          <NavLink to="/dashboard" style={getLinkStyle}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/onboarding" style={getLinkStyle}>
            🚀 Client Onboarding
          </NavLink>
          
          {/* Conditional Admin Tab */}
          {isAdmin && (
            <NavLink to="/admin/users" style={getLinkStyle}>
              ⚙️ Staff Management
            </NavLink>
          )}
        </nav>
      </div>

      {/* Bottom Section: Profile & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--af-border)', backgroundColor: 'var(--af-bg)' }}>
        <div style={{ marginBottom: '12px', paddingLeft: '8px' }}>
          <p style={{ margin: '0 0 2px 0', fontWeight: '600', fontSize: '14px' }}>
            {user?.firstName} {user?.lastName}
          </p>
          <p className="af-muted" style={{ margin: 0, fontSize: '12px', textTransform: 'capitalize' }}>
            Role: {user?.role}
          </p>
        </div>
        <button 
          onClick={logout} 
          className="af-btn af-btn-small af-btn-outline" 
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;