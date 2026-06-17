import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const token = localStorage.getItem('af_token');
    const storedUser = localStorage.getItem('af_user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setIsLoading(false);
  }, []);

  // Updated to accept data directly or run a safe local fallback
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('af_token', token);
    localStorage.setItem('af_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    delete axios.defaults.headers.common['Authorization'];
    window.location.href = '/login'; 
  };

  if (isLoading) {
    return <div className="af-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Workspace...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;