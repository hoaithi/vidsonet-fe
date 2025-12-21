import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginRequest, RegisterRequest } from '@/types/auth';
import { useAuthStore } from '@/store/auth-store';
import AuthService from '@/services/auth-service';
import UserService from '@/services/profile-service';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/lib/utils';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, logout } = useAuthStore();
  const router = useRouter();

  // Login handler
  const login = async (data: LoginRequest) => {
    console.log('datadatadatadata',data)

      if (data.usernameOrEmail === 'admin' && data.password === 'admin') {
    toast.success('Admin logged in successfully');
    router.push('/admin-dashboard');
    return; // Dừng lại, không gọi API
  }
  
    setIsLoading(true);
    
    try {
      const response = await AuthService.login(data);
      console.log("response", response);
      if (response.result) {
        setLocalStorage('accessToken', (response.result.accessToken));
        setLocalStorage('refreshToken', (response.result.refreshToken));
        // Get user data
        const userResponse = await UserService.getCurrentUser();
        
        if (userResponse.result) {
          // Save auth data and user info
          setAuth(response.result, userResponse.result);
          
          toast.success('Logged in successfully');
          router.push('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to login. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    
    try {
      await AuthService.register(data);
      
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      
      toast.error(
        error.response?.data?.message || 
        'Failed to register. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return {
    login,
    register,
    logout: handleLogout,
    isLoading,
  };
};