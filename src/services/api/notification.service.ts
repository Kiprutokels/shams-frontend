import { apiClient } from './client';
import type { Notification, ApiResponse } from '@types';

export const notificationService = {
  getAll: () =>
    apiClient.get<ApiResponse<Notification[]>>('/notifications'),

  getUnread: () =>
    apiClient.get<ApiResponse<Notification[]>>('/notifications/unread'),

  markAsRead: (id: number) =>
    apiClient.patch<ApiResponse<Notification>>(`/notifications/${id}/read`),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<void>>('/notifications/read-all'),
};
