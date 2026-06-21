import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import GlobalErrorBoundary from './components/ui/GlobalErrorBoundary';
import AuthProvider from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppShell from './components/layout/AppShell';
import ThemeToggle from './components/ui/ThemeToggle';

// Component Pages
import Login from './components/auth/Login';
import MainDashboard from './components/dashboard/MainDashboard';
import OnboardingWizard from './components/onboarding/OnboardingWizard';
import UserManagement from './components/admin/UserManagement';
import ProposalViewer from './components/proposals/ProposalViewer';
import BillingPortal from './components/billing/BillingPortal';
import WorkflowPage from './components/workflows/WorkflowPage';
import TaskDetailPage from './components/tasks/TaskDetailPage';
import ClientRoutes from './routes/ClientRoutes';

function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ThemeToggle />
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
              
              <Route path="/clients/*" element={<ClientRoutes />} />
              
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

              <Route path="/billing" element={
                <ProtectedRoute>
                  <AppShell><BillingPortal /></AppShell>
                </ProtectedRoute>
              } />

              <Route path="/workflows" element={
                <ProtectedRoute>
                  <AppShell><WorkflowPage /></AppShell>
                </ProtectedRoute>
              } />

              <Route path="/tasks/:taskId" element={
                <ProtectedRoute>
                  <AppShell><TaskDetailPage /></AppShell>
                </ProtectedRoute>
              } />

              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}

export default App;