// Calls the NestJS backend /ai/* endpoints which proxy to the Python ML service.
import { apiClient } from './client';
import type { ApiResponse, NoShowPrediction, WaitTimePrediction, PriorityClassification } from '@types';

export const aiService = {
  /** Predict no-show probability for an appointment */
  predictNoShow: (data: {
    appointment_id?: number;
    patient_id: number;
    appointment_date: string;
    appointment_type: string;
    previous_no_shows?: number;
    previous_appointments?: number;
    patient_age?: number;
  }) => apiClient.post<ApiResponse<NoShowPrediction>>('/ai/predict-noshow', data),

  /** Estimate wait time */
  estimateWaitTime: (data: {
    appointment_id?: number;
    doctor_id: number;
    appointment_date: string;
    appointment_type: string;
    current_queue_length?: number;
    time_of_day?: string;
    day_of_week?: string;
  }) => apiClient.post<ApiResponse<WaitTimePrediction>>('/ai/estimate-wait-time', data),

  /** Classify patient priority */
  classifyPriority: (data: {
    patient_id: number;
    appointment_id?: number;
    chief_complaint: string;
    symptoms?: string;
    vital_signs?: Record<string, any>;
    medical_history?: string;
    patient_age?: number;
  }) => apiClient.post<ApiResponse<PriorityClassification>>('/ai/classify-priority', data),

  /** Optimize queue for a given date/doctor */
  optimizeQueue: (data: { date: string; doctor_id?: number }) =>
    apiClient.post<ApiResponse<any>>('/ai/optimize-queue', data),

  /** Batch predictions for multiple appointments */
  batchPredict: (data: {
    appointment_ids: number[];
    prediction_type: 'no_show' | 'wait_time' | 'priority';
  }) => apiClient.post<ApiResponse<any>>('/ai/batch-predict', data),

  /** Health check */
  healthCheck: () => apiClient.get<ApiResponse<any>>('/ai/health'),
};