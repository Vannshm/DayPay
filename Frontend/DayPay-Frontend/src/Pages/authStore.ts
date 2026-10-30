import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/auth";

axios.defaults.withCredentials = true;

interface AuthState {
  username: string | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  checkAuth: ()=> Promise<void>
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
        username: response.data.user.username,
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

login: async (usernameOrEmail, password) => {
  set({ isLoading: true, error: null });

  try {
    const isEmail = usernameOrEmail.includes("@");

    const credentials = isEmail
      ? { email: usernameOrEmail, password }
      : { username: usernameOrEmail, password };

    const response = await axios.post(
      `${API_URL}/user-login`,
      credentials
    );

    set({
      username: response.data.user.username,
      isAuthenticated: true,
      isLoading: false,
    });
  } catch (err) {
    const message = axios.isAxiosError(err)
      ? err.response?.data?.message || "Error logging in"
      : "Error logging in";

    set({ error: message, isLoading: false });
    throw err;
  }
},

checkAuth: async () => {
  set({ isCheckingAuth: true });

  try {
    const response = await axios.get(
      `${API_URL}/get-Profile`
    );

    set({
      username: response.data.user.username,
      isAuthenticated: true,
      isCheckingAuth: false,
    });

  } catch (error) {
    set({
      username: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  }
},

}));
