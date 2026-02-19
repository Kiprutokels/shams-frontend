import { apiClient } from './client';
import type { NoShowPrediction, WaitTimePrediction, PriorityClassification, ApiResponse } from '@types';

export const aiService = {
  predictNoShow: (data: any) =>
    apiClient.post<ApiResponse<NoShowPrediction>>('/ai/predict-noshow', data),

  estimateWaitTime: (data: any) =>
    apiClient.post<ApiResponse<WaitTimePrediction>>('/ai/estimate-wait-time', data),

  classifyPriority: (data: any) =>
    apiClient.post<ApiResponse<PriorityClassification>>('/ai/classify-priority', data),

  optimizeQueue: (data: any) =>
    apiClient.post<ApiResponse<any>>('/ai/optimize-queue', data),

  batchPredict: (data: any) =>
    apiClient.post<ApiResponse<any>>('/ai/batch-predict', data),

  healthCheck: () =>
    apiClient.get<ApiResponse<any>>('/ai/health'),
};