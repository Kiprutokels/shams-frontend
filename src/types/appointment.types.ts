export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
  RESCHEDULED = 'RESCHEDULED',
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  LABORATORY = 'LABORATORY',
  EMERGENCY = 'EMERGENCY',
  VACCINATION = 'VACCINATION',
  CHECKUP = 'CHECKUP',
}

export enum PriorityLevel {
  EMERGENCY = 'EMERGENCY',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
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
  confirmedAt?: string;
  queuePosition?: number;
  checkedIn: boolean;
  checkInTime?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: number;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    bloodType?: string;
    allergies?: string;
    medicalHistory?: string;
  };
  doctor?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    specialization?: string;
    department?: string;
  };
}

export interface CreateAppointmentData {
  doctorId: number;
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
  chiefComplaint?: string;
  symptoms?: string;
  vitalSigns?: string;
  diagnosis?: string;
  prescription?: string;
  notes?: string;
  checkedIn?: boolean;
}