import { apiClient } from './client';
import type { ApiResponse } from '@types';

export const analyticsService = {
  getDashboardStats: () =>
    apiClient.get<ApiResponse<any>>('/analytics/dashboard'),

  getAppointmentTrends: (days?: number) =>
    apiClient.get<ApiResponse<any>>('/analytics/appointment-trends', { params: { days } }),

  getDoctorPerformance: () =>
    apiClient.get<ApiResponse<any>>('/analytics/doctor-performance'),

  getWaitTimeAnalysis: () =>
    apiClient.get<ApiResponse<any>>('/analytics/wait-time-analysis'),

  getMonthlyReport: () =>
    apiClient.get<ApiResponse<any>>('/analytics/monthly-report'),
};