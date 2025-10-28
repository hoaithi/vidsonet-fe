import apiClient, { ApiResponse } from './api-client';
import { GoogleLoginRequest, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export const AuthService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/identity/users/register', data);
    return response.data;
  },

  // Login with google
  loginGoogle: async (data: GoogleLoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/identity/auth/google', data);
    return response.data;
  },

  // Login a user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/identity/auth/login', data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/identity/auth/refresh-token',
      null,
      { params: { refreshToken } }
    );
    return response.data;
  }
,

  // Set or reset user password (first-time set for social accounts or reset)
  // Accepts email so backend knows which account to set the password for.
  resetPassword: async (
    email: string,
    newPassword: string,
    otp?: string
  ): Promise<ApiResponse<void>> => {
    const payload: Record<string, any> = { email, newPassword };
    if (otp) payload.otp = otp;

    const response = await apiClient.post<ApiResponse<void>>(
      '/identity/auth/create-password',
      payload
    );
    return response.data;
  }
};

export default AuthService;