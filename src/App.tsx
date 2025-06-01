import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DisasterProvider } from './contexts/DisasterContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AlertsPage from './pages/alerts/AlertsPage';
import ResourcesPage from './pages/resources/ResourcesPage';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DisasterProvider>
          <NotificationProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/dashboard\" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="resources" element={<ResourcesPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/\" replace />} />
            </Routes>
          </NotificationProvider>
        </DisasterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;