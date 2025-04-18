import apiClient, { ApiResponse } from './api-client';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';

export const AuthService = {
  // Register a new user
  register: async (data: RegisterRequest): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/register', data);
    return response.data;
  },

  // Login a user
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data;
  },

  // Refresh access token
  refreshToken: async (refreshToken: string): Promise<ApiResponse<AuthResponse>> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/refresh-token',
      null,
      { params: { refreshToken } }
    );
    return response.data;
  }
};

export default AuthService;