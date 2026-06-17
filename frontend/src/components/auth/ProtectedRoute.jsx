import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  // 1. If not authenticated, redirect to login but save the current location
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If a specific role is required and the user doesn't have it, redirect to dashboard
  if (requiredRole && user.role !== requiredRole) {
    console.warn(`[Access Blocked]: User role "${user.role}" does not match required "${requiredRole}"`);
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Otherwise, render the requested page
  return children;
};

export default ProtectedRoute;