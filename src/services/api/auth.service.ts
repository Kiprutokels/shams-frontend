import { apiClient } from './client';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  VerifyEmailData,
  ForgotPasswordData,
  ResetPasswordData,
  ApiResponse,
} from '@types';

export const authService = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', credentials),

  register: (data: RegisterData) =>
    apiClient.post<ApiResponse<{ message: string; userId: number; email: string }>>('/auth/register', data),

  verifyEmail: (data: VerifyEmailData) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/verify-email', data),

  resendVerification: (email: string) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/resend-verification', { email }),

  forgotPassword: (data: ForgotPasswordData) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordData) =>
    apiClient.post<ApiResponse<{ message: string }>>('/auth/reset-password', data),
};