import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';
import FadeIn from '../ui/FadeIn';

export const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axiosClient.get('/users');
        setUsers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user data. Ensure you have Admin privileges.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchUsers();
    } else {
      setIsLoading(false);
      setError('Access Denied. Administrator privileges required.');
    }
  }, [isAdmin]);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'staff' : 'admin';

    setUsers((prevUsers) => prevUsers.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));

    try {
      await axiosClient.put(`/users/${userId}`, { role: newRole });
    } catch (err) {
      console.error('Failed to update role:', err);
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === userId ? { ...u, role: currentRole } : u)));
      alert('Failed to update user role.');
    }
  };

  if (error) {
    return (
      <div className="af-dashboard">
        <div className="af-status-pill af-status-pill-staff">{error}</div>
      </div>
    );
  }

  return (
    <div className="af-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: '0 0 8px 0' }}>Staff Management</h1>
          <p className="af-muted" style={{ margin: 0 }}>Manage system access and roles.</p>
        </div>
        <button className="af-btn af-btn-primary hover-lift">
          + Invite Staff
        </button>
      </div>

      <FadeIn className="af-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: 'var(--af-bg)', borderBottom: '1px solid var(--af-border)' }}>
            <tr>
              <th className="af-label" style={{ padding: '16px 24px' }}>Name</th>
              <th className="af-label" style={{ padding: '16px 24px' }}>Email</th>
              <th className="af-label" style={{ padding: '16px 24px' }}>Role</th>
              <th className="af-label" style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center' }} className="af-muted">Loading staff...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" style={{ padding: '24px', textAlign: 'center' }} className="af-muted">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={{ borderBottom: '1px solid var(--af-border)' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '500' }}>
                    {user.firstName} {user.lastName}
                  </td>
                  <td style={{ padding: '16px 24px' }} className="af-muted">
                    {user.email}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <span className={`af-status-pill ${user.role === 'admin' ? 'af-status-pill-admin' : 'af-status-pill-staff'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <button
                      onClick={() => toggleRole(user.id, user.role)}
                      className="af-btn af-btn-small af-btn-secondary"
                    >
                      Make {user.role === 'admin' ? 'Staff' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </FadeIn>
    </div>
  );
};

export default UserManagement;
