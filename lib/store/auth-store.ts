// lib/stores/auth-store.ts
import { User, UserRole } from "@/lib/types/auth-types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: {
        id: "cmjyvgw200000yktxi5ofzegy",
        email: "estabannd@gmail.com",
        firstName: "Esteban",
        lastName: "Ndip",
        role: UserRole.USER,
        imageUrl:
          "https://media.licdn.com/dms/image/v2/D4E03AQEHNwkI8rNb4w/profile-displayphoto-scale_400_400/B4EZqa1AWSGoAg-/0/1763534183626?e=1770854400&v=beta&t=HAV3L_f5LJ4gd6XdhyjOt7nso1LMJEMTY52dv5AKLRA",
        emailVerified: true,
        lastLoginAt: "2025-11-18T10:37:23.000Z",
        createdAt: "2025-11-18T10:37:23.000Z",
        updatedAt: "2025-06-12T14:21:28.000Z",
      },
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
