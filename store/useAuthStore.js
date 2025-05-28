import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      authCheck: async () => {
        try {
          const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.success) {
            set({ user: data.data, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Error checking authentication:", error);
          set({ user: null, isAuthenticated: false });
        }
      },

      logout: async () => {
        try {
          const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.success) {
            set({ user: null, isAuthenticated: false });
          }
        } catch (error) {
          console.error("Error logging out:", error);
        }
      }
    }),
    {
      name: "auth-storage", // unique name for localStorage
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
