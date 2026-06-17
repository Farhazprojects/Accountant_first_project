import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary';
import AuthProvider from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';

// Component Pages
import Login from './components/auth/Login';
import MainDashboard from './components/dashboard/MainDashboard';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import UserManagement from './components/admin/UserManagement';
import ProposalViewer from './components/proposals/ProposalViewer';

function App() {
  return (
    <GlobalErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Entry Points */}
            <Route path="/login" element={<Login />} />
            <Route path="/proposal/:proposalId" element={<ProposalViewer />} />
            
            {/* Authenticated Workspace App Shell */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AppShell><MainDashboard /></AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <AppShell><OnboardingWizard /></AppShell>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/users" element={
              <ProtectedRoute requiredRole="admin">
                <AppShell><UserManagement /></AppShell>
              </ProtectedRoute>
            } />
            
            {/* Global Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GlobalErrorBoundary>
  );
}

export default App;