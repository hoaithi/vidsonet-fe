import apiClient, { ApiResponse } from './api-client';
import { GoogleLoginRequest, LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export const AuthService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/identity/auth/register', data);
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
};

export default AuthService;