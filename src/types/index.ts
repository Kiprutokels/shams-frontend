import { UserRole } from './user.types';

export * from './common.types';
export * from './user.types';
export * from './auth.types';
export * from './appointment.types';
export * from './queue.types';
export * from './notification.types';
export * from './ai.types';

// Admin create user payload
export interface CreateUserData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  sendInviteEmail?: boolean;
}