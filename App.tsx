import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AttendanceHistory from './pages/employee/AttendanceHistory';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import Reports from './pages/manager/Reports';
import Employees from './pages/manager/Employees';
import { useStore } from './store/useStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode; allowedRole?: string }) => {
  const { isAuthenticated, currentUser } = useStore();
  
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && currentUser.role !== allowedRole) {
    // Redirect to their appropriate dashboard if they try to access wrong area
    return <Navigate to={currentUser.role === 'manager' ? '/manager/dashboard' : '/employee/dashboard'} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Employee Routes */}
        <Route path="/employee" element={
          <ProtectedRoute allowedRole="employee">
            <Layout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<EmployeeDashboard />} />
          <Route path="history" element={<AttendanceHistory />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={
          <ProtectedRoute allowedRole="manager">
            <Layout />
          </ProtectedRoute>
        }>
           <Route path="dashboard" element={<ManagerDashboard />} />
           <Route path="reports" element={<Reports />} />
           <Route path="employees" element={<Employees />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;