import { apiClient } from './client';
import type { User, UserStats, ApiResponse } from '@types';

export const userService = {
  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/users/profile'),

  updateProfile: (id: number, data: Partial<User>) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  getStats: () =>
    apiClient.get<ApiResponse<UserStats>>('/users/stats'),

  getDoctors: (specialization?: string) => {
    const params = specialization ? { specialization } : {};
    return apiClient.get<ApiResponse<User[]>>('/users/doctors', { params });
  },

  getAllUsers: (role?: string) => {
    const params = role ? { role } : {};
    return apiClient.get<ApiResponse<User[]>>('/users', { params });
  },

  getUserById: (id: number) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  deleteUser: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),
};