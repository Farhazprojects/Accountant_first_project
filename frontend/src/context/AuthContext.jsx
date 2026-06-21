import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axiosClient.get('/auth/me');
          setUser(response.data.user ?? response.data.data?.user);
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    const token = response.data.token ?? response.data.data?.token;
    const userData = response.data.user ?? response.data.data?.user;

    if (!token || !userData) {
      throw new Error('Login response missing token or user.');
    }

    localStorage.setItem('token', token);
    setUser(userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.isAdmin === true;

  if (loading) {
    return (
      <div className="af-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p className="af-muted">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
