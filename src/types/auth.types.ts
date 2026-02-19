import { User, UserRole } from "./user.types";


export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
}

export interface RegisterData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  specialization?: string;
  licenseNumber?: string;
  department?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface VerifyEmailData {
  email: string;
  code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}