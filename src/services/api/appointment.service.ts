import { apiClient } from './client';
import type {
  Appointment,
  CreateAppointmentData,
  UpdateAppointmentData,
  ApiResponse,
  PaginatedResponse,
} from '@types';

export const appointmentService = {
  create: (data: CreateAppointmentData) =>
    apiClient.post<ApiResponse<Appointment>>('/appointments', data),

  getAll: (params?: any) =>
    apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>('/appointments', { params }),

  getById: (id: number) =>
    apiClient.get<ApiResponse<Appointment>>(`/appointments/${id}`),

  update: (id: number, data: UpdateAppointmentData) =>
    apiClient.patch<ApiResponse<Appointment>>(`/appointments/${id}`, data),

  cancel: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/appointments/${id}`),

  getUpcoming: () =>
    apiClient.get<ApiResponse<Appointment[]>>('/appointments/upcoming'),

  getHistory: () =>
    apiClient.get<ApiResponse<Appointment[]>>('/appointments/history'),
};