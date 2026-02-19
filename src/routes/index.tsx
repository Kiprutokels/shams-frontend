import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { RoleRoute } from './RoleRoute';
import { DashboardLayout } from '@components/layout/DashboardLayout/DashboardLayout';

// Auth Pages
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { VerifyEmailPage } from '@pages/auth/VerifyEmailPage';

// Patient Pages
import { PatientDashboard } from '@pages/patient/PatientDashboard';

// Doctor Pages
import { DoctorDashboard } from '@pages/doctor/DoctorDashboard';

// Admin Pages
import { AdminDashboard } from '@pages/admin/AdminDashboard';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* Patient Routes */}
        <Route element={<RoleRoute allowedRoles={['PATIENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            {/* Add more patient routes here */}
          </Route>
        </Route>

        {/* Doctor Routes */}
        <Route element={<RoleRoute allowedRoles={['DOCTOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            {/* Add more doctor routes here */}
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
