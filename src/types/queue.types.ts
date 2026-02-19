export enum QueueStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  LEFT = 'LEFT',
}

export interface Queue {
  id: number;
  queueDate: string;
  department: string;
  queueNumber: number;
  patientId: number;
  appointmentId?: number;
  patientName: string;
  status: QueueStatus;
  priorityLevel: string;
  priorityScore: number;
  checkInTime: string;
  calledTime?: string;
  serviceStartTime?: string;
  serviceEndTime?: string;
  estimatedWaitTime?: number;
  actualWaitTime?: number;
  serviceType: string;
  doctorName?: string;
  roomNumber?: string;
  isEmergency: boolean;
  notified: boolean;
  createdAt: string;
  updatedAt: string;
}