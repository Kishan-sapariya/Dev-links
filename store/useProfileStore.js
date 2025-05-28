
import { create } from 'zustand';

const useProfileStore = create((set, get) => ({
  // State
  user: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUser: (user) => set({ user }),
  clearProfile: () => set({ user: null, error: null, loading: false }),

  // Fetch profile function
  fetchProfile: async (username) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/profile/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`User "${username}" not found.`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        set({ user: data.data, loading: false });
        return data.data;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  // Update profile function
  updateProfile: async (username, profileData) => {
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/profile/${username}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      
      if (data.success) {
        set({ user: data.data, loading: false });
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      set({ error: err.message, loading: false });
      throw err;
    }
  }
}));

export default useProfileStore;
