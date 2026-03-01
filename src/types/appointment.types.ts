// ─── Enums ────────────────────────────────────────────────────────────────────
export enum AppointmentStatus {
  SCHEDULED   = 'SCHEDULED',
  CONFIRMED   = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED   = 'COMPLETED',
  CANCELLED   = 'CANCELLED',
  NO_SHOW     = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP    = 'FOLLOW_UP',
  LABORATORY   = 'LABORATORY',
  EMERGENCY    = 'EMERGENCY',
  VACCINATION  = 'VACCINATION',
  CHECKUP      = 'CHECKUP',
}

export enum PriorityLevel {
  EMERGENCY = 'EMERGENCY',
  HIGH      = 'HIGH',
  MEDIUM    = 'MEDIUM',
  LOW       = 'LOW',
}

// ─── Domain models ────────────────────────────────────────────────────────────
export interface AppointmentPatient {
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  bloodType?: string;
  allergies?: string;
  medicalHistory?: string;
}

export interface AppointmentDoctor {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  specialization?: string;
  department?: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number | null;
  appointmentDate: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  priority: PriorityLevel;
  durationMinutes: number;
  estimatedWaitTime?: number;
  actualStartTime?: string;
  actualEndTime?: string;
  noShowProbability?: number;
  predictedDuration?: number;
  aiPriorityScore?: number;
  chiefComplaint?: string;
  symptoms?: string;
  vitalSigns?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  reminderSent: boolean;
  reminderSentAt?: string;
  confirmationRequired: boolean;
  confirmedAt?: string;           // set when ADMIN/NURSE confirms
  queuePosition?: number;
  checkedIn: boolean;
  checkInTime?: string;
  createdAt: string;
  updatedAt: string;
  patient?: AppointmentPatient;
  doctor?: AppointmentDoctor | null;
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────
export interface CreateAppointmentData {
  doctorId?: number;
  appointmentDate: string;
  appointmentType: AppointmentType;
  priority?: PriorityLevel;
  durationMinutes?: number;
  chiefComplaint?: string;
  symptoms?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  appointmentDate?: string;
  status?: AppointmentStatus;
  priority?: PriorityLevel;
  durationMinutes?: number;
  doctorId?: number | null;        // admin/nurse only
  chiefComplaint?: string;
  symptoms?: string;
  vitalSigns?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  checkedIn?: boolean;
}

// ─── Misc ─────────────────────────────────────────────────────────────────────
export interface SelectOption {
  label: string;
  value: string | number;
}
