import { apiClient } from "./client";
import type { Queue, ApiResponse } from "@types";

export const queueService = {
  /** Get all queue entries for today (filtered by department / status) */
  getAll: (params?: { department?: string; status?: string }) =>
    apiClient.get<ApiResponse<Queue[]>>("/queue", { params }),

  /** Get my current queue position (patient) */
  getMyPosition: () =>
    apiClient.get<ApiResponse<Queue & { position: number }>>(
      "/queue/my-position",
    ),

  /**
   * Patient check-in → creates queue entry.
   * Backend also marks the appointment as checkedIn.
   */
  checkIn: (data: {
    patientId: number;
    appointmentId?: number;
    patientName: string;
    department: string;
    serviceType: string;
    doctorName?: string;
    priorityLevel?: string;
    isEmergency?: boolean;
  }) => apiClient.post<ApiResponse<Queue>>("/queue", data),

  /** Update queue entry status (doctor side) */
  update: (
    id: number,
    data: {
      status?: string;
      calledTime?: string;
      serviceStartTime?: string;
      serviceEndTime?: string;
      estimatedWaitTime?: number;
      roomNumber?: string;
    },
  ) => apiClient.patch<ApiResponse<Queue>>(`/queue/${id}`, data),

  /** Get single entry */
  getById: (id: number) => apiClient.get<ApiResponse<Queue>>(`/queue/${id}`),
};
