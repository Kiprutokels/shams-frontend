// ============================================
export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
  NURSE = 'NURSE',
}

export interface User {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface UserStats {
  total?: number;
  upcoming?: number;
  completed?: number;
  cancelled?: number;
  today?: number;
  pending?: number;
}