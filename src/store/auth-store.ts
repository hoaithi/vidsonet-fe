// import { create } from 'zustand';// import { persist } from 'zustand/middleware';
// import { AuthResponse } from '@/types/auth';
// import { Profile } from '@/types/profile';
// import { setLocalStorage, removeLocalStorage } from '@/lib/utils';

// interface AuthState {
//   isAuthenticated: boolean;
//   profile: Profile | null;
//   accessToken: string | null;
//   refreshToken: string | null;
//   // Actions
//   setAuth: (authResponse: AuthResponse, profile?: Profile) => void;
//   updateProfile: (profile: Profile) => void;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       isAuthenticated: false,
//       profile: null,
//       accessToken: null,
//       refreshToken: null,

//       setAuth: (authResponse: AuthResponse, profile?: Profile) => {
//         setLocalStorage('accessToken', authResponse.accessToken);
//         setLocalStorage('refreshToken', authResponse.refreshToken);

//         set({
//           isAuthenticated: true,
//           profile,
//           accessToken: authResponse.accessToken,
//           refreshToken: authResponse.refreshToken,
//         });
//       },

//       updateProfile: (profile: Profile) => {
//         set({ profile });
//       },

//       logout: () => {
//         removeLocalStorage('accessToken');
//         removeLocalStorage('refreshToken');

//         set({
//           isAuthenticated: false,
//           profile: null,
//           accessToken: null,
//           refreshToken: null,
//         });
//       },
//     }),
//     {
//       name: 'auth-storage',
//       partialize: (state) => ({
//         isAuthenticated: state.isAuthenticated,
//         profile: state.profile,
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//       }),
//     }
//   )
// );

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthResponse } from "@/types/auth";
import { Profile } from "@/types/profile";
import { removeLocalStorage } from "@/lib/utils";

interface AuthState {
  isAuthenticated: boolean;
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  _hasHydrated: boolean; // ✅ Track hydration state

  // Actions
  setAuth: (authResponse: AuthResponse, profile?: Profile) => void;
  updateProfile: (profile: Profile) => void;
  logout: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      profile: null,
      accessToken: null,
      refreshToken: null,
      _hasHydrated: false,

      setAuth: (authResponse: AuthResponse, profile?: Profile) => {
        // ❌ REMOVE double storage - chỉ dùng Zustand persist
        // setLocalStorage('accessToken', authResponse.accessToken);
        // setLocalStorage('refreshToken', authResponse.refreshToken);

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
        // Clear persisted auth and legacy tokens in localStorage
        try {
          removeLocalStorage("auth-storage");
          removeLocalStorage("accessToken");
          removeLocalStorage("refreshToken");
          removeLocalStorage("user");
        } catch (e) {
          // no-op: best-effort cleanup
        }

        set({
          isAuthenticated: false,
          profile: null,
          accessToken: null,
          refreshToken: null,
        });
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        profile: state.profile,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
      onRehydrateStorage: () => (state) => {
        // ✅ Set hydrated flag when done
        console.log("🔵 Zustand hydration complete");
        state?.setHasHydrated(true);
      },
    }
  )
);

// ✅ Export selector to check if hydrated
export const useHasHydrated = () => useAuthStore((state) => state._hasHydrated);
