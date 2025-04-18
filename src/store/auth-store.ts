import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/types/auth';
import { User } from '@/types/user';
import { setLocalStorage, removeLocalStorage } from '@/lib/utils';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  
  // Actions
  setAuth: (authResponse: AuthResponse, user: User) => void;
  updateUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      
      setAuth: (authResponse: AuthResponse, user: User) => {
        setLocalStorage('accessToken', authResponse.accessToken);
        setLocalStorage('refreshToken', authResponse.refreshToken);
        
        set({
          isAuthenticated: true,
          user,
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
        });
      },
      
      updateUser: (user: User) => {
        set({ user });
      },
      
      logout: () => {
        removeLocalStorage('accessToken');
        removeLocalStorage('refreshToken');
        
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);