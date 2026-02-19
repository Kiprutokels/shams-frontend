export enum NotificationType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  READ = 'READ',
}

export interface Notification {
  id: number;
  userId: number;
  appointmentId?: number;
  notificationType: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  templateName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  errorMessage?: string;
  retryCount: number;
  isRead: boolean;
  priority: string;
  createdAt: string;
  updatedAt: string;
}