
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AppShell from '../components/layout/AppShell';
import ClientList from '../components/clients/ClientList';
import ClientDetail from '../components/clients/ClientDetail';
import ClientCreate from '../components/clients/ClientCreate';

function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <AppShell><ClientList /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/new" element={
        <ProtectedRoute requiredRole="admin">
          <AppShell><ClientCreate /></AppShell>
        </ProtectedRoute>
      } />
      <Route path="/:id" element={
        <ProtectedRoute>
          <AppShell><ClientDetail /></AppShell>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default ClientRoutes;
