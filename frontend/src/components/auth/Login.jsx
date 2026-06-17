import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FadeIn from '../ui/FadeIn';
import { useAuth } from '../../context/AuthContext.jsx'; // Targets your context file directly

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Grabs the global login hook

  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fire to your backend bypass login route
      const response = await axios.post('http://localhost:5000/api/auth/login', credentials);
      
      // 2. Destructure the custom token and user shapes we built
      const { token, user } = response.data;

      // 3. CRITICAL: Run the global auth context function to tell React we are logged in
      login(user, token);

      // 4. Send the user to the dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to log in. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="af-page" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'var(--af-secondary)' 
      }}
    >
      <FadeIn className="af-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', color: 'var(--af-primary)' }}>Accountant First</h1>
          <p className="af-muted" style={{ margin: 0 }}>Sign in to your workspace</p>
        </div>

        {error && (
          <div 
            className="mb-24" 
            style={{ 
              backgroundColor: '#fee2e2', 
              color: 'var(--af-danger)', 
              padding: '12px', 
              borderRadius: '8px',
              fontSize: '14px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-24">
            <label className="af-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className="af-input"
              placeholder="admin@accountantfirst.com"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-24">
            <label className="af-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className="af-input"
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="af-btn af-btn-primary hover-lift" 
            style={{ width: '100%', padding: '12px' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </FadeIn>
    </div>
  );
};

export default Login;