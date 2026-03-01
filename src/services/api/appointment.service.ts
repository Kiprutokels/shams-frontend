import { apiClient } from './client';
import type {
  Appointment,
  ApiResponse,
  PaginatedResponse,
  CreateAppointmentData,
  UpdateAppointmentData,
} from '@types';

export const appointmentService = {
  // ─── CRUD ──────────────────────────────────────────────────────────────────

  create: async (body: CreateAppointmentData): Promise<Appointment> => {
    const res = await apiClient.post<ApiResponse<Appointment>>(
      '/appointments',
      body,
    );
    return res.data;
  },

  getAll: async (
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<Appointment>> => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Appointment>>>(
      '/appointments',
      { params },
    );
    return res.data;
  },

  getById: async (id: number): Promise<Appointment> => {
    const res = await apiClient.get<ApiResponse<Appointment>>(
      `/appointments/${id}`,
    );
    return res.data;
  },

  update: async (
    id: number,
    body: UpdateAppointmentData,
  ): Promise<Appointment> => {
    const res = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      body,
    );
    return res.data;
  },

  cancel: async (id: number): Promise<Appointment> => {
    const res = await apiClient.delete<ApiResponse<Appointment>>(
      `/appointments/${id}`,
    );
    return res.data;
  },

  // ─── Confirm (ADMIN / NURSE) ───────────────────────────────────────────────
  confirm: async (id: number): Promise<Appointment> => {
    const res = await apiClient.post<ApiResponse<Appointment>>(
      `/appointments/${id}/confirm`,
    );
    return res.data;
  },

  // ─── Check-in (PATIENT) ───────────────────────────────────────────────────
  checkIn: async (id: number): Promise<Appointment> => {
    const res = await apiClient.patch<ApiResponse<Appointment>>(
      `/appointments/${id}`,
      { checkedIn: true },
    );
    return res.data;
  },

  // ─── Convenience queries ──────────────────────────────────────────────────

  getUpcoming: async (): Promise<Appointment[]> => {
    const res = await apiClient.get<ApiResponse<Appointment[]>>(
      '/appointments/upcoming',
    );
    return res.data;
  },

  getHistory: async (): Promise<Appointment[]> => {
    const res = await apiClient.get<ApiResponse<Appointment[]>>(
      '/appointments/history',
    );
    return res.data;
  },
};
