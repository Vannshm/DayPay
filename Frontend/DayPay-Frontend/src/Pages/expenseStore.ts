import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/expense"

axios.defaults.withCredentials = true;

interface AuthState{
    error: string | null;
  isLoading: boolean;
  expenses: any[];

  getAllExpenses: () => Promise<void>
}

export const useExpenseStore = create<AuthState>((set) => ({
  error : null,
  isLoading: false,
  expenses:[],

    getAllExpenses: async () => {
      set({ isLoading: true, error: null });
    try {
      const response = await axios(`${API_URL}/allExpenses`)
      set({
        expenses:response.data.expenses,
        isLoading:false
      })

    } catch (err) {
      set({
        error: "Failed to fetch expenses",
        isLoading: false
      });
    }
  },
}))