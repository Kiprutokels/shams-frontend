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
import { BookAppointmentPage } from '@pages/patient/BookAppointmentPage';
import { MyAppointmentsPage } from '@pages/patient/MyAppointmentsPage';
import { QueueStatusPage } from '@pages/patient/QueueStatusPage';
import { MedicalHistoryPage } from '@pages/patient/MedicalHistoryPage';
import { PatientProfilePage } from '@pages/patient/PatientProfilePage';

// Doctor Pages
import { DoctorDashboard } from '@pages/doctor/DoctorDashboard';
import { DoctorSchedulePage } from '@pages/doctor/DoctorSchedulePage';
import { DoctorQueuePage } from '@pages/doctor/DoctorQueuePage';
import { DoctorAppointmentsPage } from '@pages/doctor/DoctorAppointmentsPage';
import { DoctorProfilePage } from '@pages/doctor/DoctorProfilePage';

// Admin Pages
import { AdminDashboard } from '@pages/admin/AdminDashboard';
import { AdminUsersPage } from '@pages/admin/AdminUsersPage';
import { AdminAppointmentsPage } from '@pages/admin/AdminAppointmentsPage';
import { AdminAnalyticsPage } from '@pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from '@pages/admin/AdminSettingsPage';

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
        <Route path="/patient" element={<RoleRoute allowedRoles={['PATIENT']} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<PatientDashboard />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="book-appointment" element={<BookAppointmentPage />} />
            <Route path="appointments" element={<MyAppointmentsPage />} />
            <Route path="queue-status" element={<QueueStatusPage />} />
            <Route path="medical-history" element={<MedicalHistoryPage />} />
            <Route path="profile" element={<PatientProfilePage />} />
          </Route>
        </Route>

        {/* Doctor Routes */}
        <Route path="/doctor" element={<RoleRoute allowedRoles={['DOCTOR']} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DoctorDashboard />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="schedule" element={<DoctorSchedulePage />} />
            <Route path="queue" element={<DoctorQueuePage />} />
            <Route path="appointments" element={<DoctorAppointmentsPage />} />
            <Route path="profile" element={<DoctorProfilePage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<RoleRoute allowedRoles={['ADMIN']} />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="appointments" element={<AdminAppointmentsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
