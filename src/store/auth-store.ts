import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthResponse } from '@/types/auth';
import { Profile } from '@/types/profile';
import { setLocalStorage, removeLocalStorage } from '@/lib/utils';

interface AuthState {
  isAuthenticated: boolean;
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  // Actions
  setAuth: (authResponse: AuthResponse, profile?: Profile) => void;
  updateProfile: (profile: Profile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      profile: null,
      accessToken: null,
      refreshToken: null,
      
      setAuth: (authResponse: AuthResponse, profile?: Profile) => {
        setLocalStorage('accessToken', authResponse.accessToken);
        setLocalStorage('refreshToken', authResponse.refreshToken);
        
        set({
          isAuthenticated: true,
          profile,
          accessToken: authResponse.accessToken,
          refreshToken: authResponse.refreshToken,
        });
      },
      
      updateProfile: (profile: Profile) => {
        set({ profile });
      },
      
      logout: () => {
        removeLocalStorage('accessToken');
        removeLocalStorage('refreshToken');
        
        set({
          isAuthenticated: false,
          profile: null,
          accessToken: null,
          refreshToken: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);