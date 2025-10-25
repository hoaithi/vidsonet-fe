import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

// API response interface
export interface ApiResponse<T> {
  code: number;
  message: string;
  result?: T;
}

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorage('accessToken') || useAuthStore.getState().accessToken;
    console.log("Token available:", !!token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header set:", config.headers.Authorization);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError<ApiResponse<any>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // If error is 401 (Unauthorized) and not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh token
        const refreshToken = getLocalStorage('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          removeLocalStorage('accessToken');
          removeLocalStorage('refreshToken');
          removeLocalStorage('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Call refresh token endpoint
        const response = await axios.post<ApiResponse<{ accessToken: string, refreshToken: string }>>(
          `${process.env.NEXT_PUBLIC_API_URL}/identity/auth/refresh-token`,
          { refreshToken }
        );
        
        if (response.data.result) {
          // Update stored tokens
          setLocalStorage('accessToken', response.data.result.accessToken);
          setLocalStorage('refreshToken', response.data.result.refreshToken);
          
          // Retry the original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.result.accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        removeLocalStorage('accessToken');
        removeLocalStorage('refreshToken');
        removeLocalStorage('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;