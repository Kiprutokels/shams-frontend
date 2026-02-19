import { apiClient } from './client';
import type { Queue, ApiResponse } from '@types';

export const queueService = {
  getAll: (params?: { department?: string; status?: string }) =>
    apiClient.get<ApiResponse<Queue[]>>('/queue', { params }),

  getMyPosition: () =>
    apiClient.get<ApiResponse<Queue & { position: number }>>('/queue/my-position'),

  checkIn: (data: any) =>
    apiClient.post<ApiResponse<Queue>>('/queue', data),

  update: (id: number, data: any) =>
    apiClient.patch<ApiResponse<Queue>>(`/queue/${id}`, data),
};