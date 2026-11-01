import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/api/expense";

axios.defaults.withCredentials = true;

// 1. Define expense categories
export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "health"
  | "entertainment"
  | "education"
  | "other";

// 2. Define payment methods
export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "other";

export interface DashboardSummary {
  totalExpenses: number;
  expenseCount: number;
}

export interface CategorySpending {
  _id:ExpenseCategory;
  totalSpending:number,
  expenseCount:number
}

// 3. Define the structure of one expense
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  paymentMethod: PaymentMethod;
  date: string;
  note?: string;
}

interface AuthState {
  error: string | null;
  isLoading: boolean;
  isDeleting: boolean;

  summary: DashboardSummary | null;
  expenses: Expense[];

  categorySummary: CategorySpending[];
  topExpense: CategorySpending | null;

  getAllExpenses: () => Promise<void>;
  dashboard: () => Promise<void>;
  deleteExpense: (expenseId: string) => Promise<void>;
  addExpense: (
    title: string,
    amount: number,
    category: ExpenseCategory,
    date: string,
    note: string,
    paymentMethod: PaymentMethod,
  ) => Promise<void>;
  getCategorySummary: () => Promise<void>;
  searchExpense: (searchTerm: string) => Promise<void>
}

export const useExpenseStore = create<AuthState>((set,get) => ({
  error: null,
  isLoading: false,
  isDeleting: false,
  expenses: [],
  summary: null,
  categorySummary:[],
  topExpense: null,

  getAllExpenses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios(`${API_URL}/allExpenses`);
      set({
        expenses: response.data.expenses,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to fetch expenses",
        isLoading: false,
      });
    }
  },

  dashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios(`${API_URL}/dashboard`);
      set({
        summary: response.data,
        isLoading: false,
      });
    } catch (err) {
      set({
        error: "Failed to fetch expenses",
        isLoading: false,
      });
    }
  },

  deleteExpense: async (expenseId: string) => {
    set({ isDeleting: true, error: null });
    try {
      await axios.delete(`${API_URL}/deleteExpense/${expenseId}`);

      set((state) => {
        const deleteExpense = state.expenses.find(
          (expense) => expense._id === expenseId,
        );

        if (!deleteExpense) {
          return { isDeleting: false };
        }

        return {
          expenses: state.expenses.filter(
            (expense) => expense._id !== expenseId,
          ),

          summary: state.summary
            ? {
                totalExpenses:
                  state.summary.totalExpenses - deleteExpense.amount,
                expenseCount: state.summary.expenseCount - 1,
              }
            : null,
          isDeleting: false,
        };
      });
      await get().getCategorySummary();
    } catch (err) {
      set({
        error: "Failed to fetch expenses",
        isDeleting: false,
      });
    }
  },

  addExpense: async (title, amount, category, date, note, paymentMethod) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/addExpense`, {
        title,
        amount,
        category,
        date,
        note,
        paymentMethod,
      });
      set((state) => ({
        expenses: [response.data.expense, ...state.expenses],

        summary: state.summary
          ? {
              totalExpenses: state.summary.totalExpenses + amount,
              expenseCount: state.summary.expenseCount + 1,
            }
          : null,
        isLoading: false,
      }));
      await get().getCategorySummary();
    } catch (err) {
      set({
        error: "Failed to add expenses",
        isLoading: false,
      });
    }
  },

  getCategorySummary: async() => {
    set({ isLoading: true, error: null });
    try {

      const response = await axios.get(`${API_URL}/categorySpending`);
      set({
        categorySummary: response.data.summary,
        topExpense: response.data.summary[0] ?? null,
        isLoading:false
      })

    } catch (err) {
      set({
        error: "Failed to add expenses",
        isLoading: false,
      });
    }
  },

  searchExpense: async(searchTerm) => {
    set({isLoading:true,error:null});
    try{

        const response = await axios.get(`${API_URL}/searchExpense`,{
          params:{
            q:searchTerm,
            page:1,
            limit:100,
            sortBy:"date",
            order:"desc"
          }
        });

        set({
          expenses:response.data.expense,
          isLoading:false
        })

    }catch(err){
    set({
      error: "Failed to search expenses",
      isLoading: false,
    });
    }
  },

  
}));
