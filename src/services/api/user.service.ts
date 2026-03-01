import { apiClient } from './client';
import type { User, UserStats, ApiResponse, CreateUserData } from '@types';

export const userService = {
  /** Get own profile */
  getProfile: () =>
    apiClient.get<ApiResponse<User>>('/users/profile'),

  /** Update own profile */
  updateProfile: (id: number, data: Partial<User> & { isActive?: boolean }) =>
    apiClient.patch<ApiResponse<User>>(`/users/${id}`, data),

  /** Get own stats */
  getStats: () =>
    apiClient.get<ApiResponse<UserStats>>('/users/stats'),

  /** List doctors (optional filter by specialization) */
  getDoctors: (specialization?: string) => {
    const params = specialization ? { specialization } : {};
    return apiClient.get<ApiResponse<User[]>>('/users/doctors', { params });
  },

  /** List all users – ADMIN only */
  getAllUsers: (role?: string) => {
    const params = role ? { role } : {};
    return apiClient.get<ApiResponse<User[]>>('/users', { params });
  },

  /** Get single user by id */
  getUserById: (id: number) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  /** Delete / deactivate user – ADMIN only */
  deleteUser: (id: number) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),

  /**
   * Admin / Doctor creates a new user account.
   * Backend sends invite email when sendInviteEmail = true.
   */
  adminCreateUser: (data: CreateUserData) =>
    apiClient.post<ApiResponse<{ message: string; userId: number }>>('/users', data),
};