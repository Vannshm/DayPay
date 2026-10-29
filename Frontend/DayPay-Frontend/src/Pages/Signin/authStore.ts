import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

interface AuthState {
  username: any | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  username: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/user-register`, {
        username,
        email,
        password,
      });
      set({
        username: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Error signing up"
        : "Error signing up";

      set({ error: message, isLoading: false });
      throw err;
    }
  },
}));
