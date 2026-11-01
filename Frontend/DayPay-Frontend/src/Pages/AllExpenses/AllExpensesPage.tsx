import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  WalletCards,
  LayoutDashboard,
  CirclePlus,
  ReceiptText,
  Shapes,
  ChartNoAxesCombined,
  LogOut,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  EllipsisVertical,
  Pencil,
  Trash2,
  Utensils,
  BusFront,
  ShoppingBag,
  Zap,
  Clapperboard,
  HeartPulse,
  GraduationCap,
  CircleEllipsis,
  Menu,
  X,
  Clock3,
  Smartphone,
} from "lucide-react";
import "./AllExpensesPage.css";
import { useExpenseStore } from "../expenseStore";
import { useNavigate } from "react-router-dom";
import type { NavItem } from "../Home/NavItem";
import { SideBar } from "../Home/SideBar";

export type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "health"
  | "entertainment"
  | "education"
  | "other";

export type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "other";

// This type follows the fields returned by your MongoDB expense model.
export type ExpenseRecord = {
  _id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  createdAt?: string;
  updatedAt?: string;
};

type PageName =
  | "Dashboard"
  | "Add Expense"
  | "All Expenses"
  | "Categories"
  | "Reports";

type AllExpensesPageProps = {
  // TODO(authStore): Pass getAllExpense() here. It must return response.data.expenses.
  onLoadExpenses?: () => Promise<ExpenseRecord[]>;
  // TODO(authStore): Connect this to updateExpense(expenseId), or open your edit-expense form.
  onEditExpense?: (expense: ExpenseRecord) => void;
  // TODO(authStore): Connect this to deleteExpense(expenseId).
  onDeleteExpense?: (expenseId: string) => void;
  // TODO(router): Connect this to your React Router navigation.
  onNavigate?: (page: PageName) => void;
  // TODO(authStore): Connect this to logout() from your auth store.
  onLogout?: () => void;
  // TODO(authStore): Replace the default value with the username from useAuthStore().
  username?: string;
};

type DateGroup = {
  key: string;
  label: string;
  expenses: ExpenseRecord[];
  total: number;
};

const PAGE_SIZE = 4; // Number of date groups shown on one page, matching the reference layout.

const navItems: { label: PageName; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Add Expense", icon: CirclePlus },
  { label: "All Expenses", icon: ReceiptText },
  { label: "Categories", icon: Shapes },
  { label: "Reports", icon: ChartNoAxesCombined },
];

const categoryLabels: Record<ExpenseCategory, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  bills: "Bills",
  health: "Health",
  entertainment: "Entertainment",
  education: "Education",
  other: "Other",
};

const categoryIcons: Record<ExpenseCategory, typeof Utensils> = {
  food: Utensils,
  transport: BusFront,
  shopping: ShoppingBag,
  bills: Zap,
  health: HeartPulse,
  entertainment: Clapperboard,
  education: GraduationCap,
  other: CircleEllipsis,
};

const paymentLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  bank_transfer: "Bank transfer",
  other: "Other",
};

// SAMPLE DATA: Used only until you connect the getAllExpense() action from authStore.
const sampleExpenses: ExpenseRecord[] = [
  {
    _id: "sample-1",
    title: "Food",
    amount: 450,
    category: "food",
    date: "2026-08-25T14:30:00",
    note: "Lunch at restaurant",
    paymentMethod: "upi",
  },
  {
    _id: "sample-2",
    title: "Transport",
    amount: 400,
    category: "transport",
    date: "2026-08-25T10:15:00",
    note: "Bus fare",
    paymentMethod: "cash",
  },
  {
    _id: "sample-3",
    title: "Shopping",
    amount: 720,
    category: "shopping",
    date: "2026-05-10T18:20:00",
    note: "Bought some essentials",
    paymentMethod: "card",
  },
  {
    _id: "sample-4",
    title: "Bills",
    amount: 1200,
    category: "bills",
    date: "2026-03-02T09:00:00",
    note: "Electricity bill",
    paymentMethod: "upi",
  },
  {
    _id: "sample-5",
    title: "Education",
    amount: 850,
    category: "education",
    date: "2026-02-18T16:45:00",
    note: "Course material",
    paymentMethod: "bank_transfer",
  },
];

// Formats numbers as Indian rupees.
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

// Converts an expense date into a local calendar-day key for grouping.
const getDateKey = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "unknown-date";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Displays group headers like "25 Aug 2026".
const formatGroupDate = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Unknown date";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Displays the time part of the Date field. If the backend saves date-only values, this will be 12:00 AM.
const formatExpenseTime = (dateValue: string) => {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "--:--";

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
};

// Groups expenses by their expense date and calculates a total for each day.
const groupExpensesByDate = (expenses: ExpenseRecord[]): DateGroup[] => {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const grouped = new Map<string, ExpenseRecord[]>();

  sortedExpenses.forEach((expense) => {
    const key = getDateKey(expense.date);
    const existing = grouped.get(key) ?? [];
    existing.push(expense);
    grouped.set(key, existing);
  });

  return Array.from(grouped.entries()).map(([key, items]) => ({
    key,
    label: formatGroupDate(items[0].date),
    expenses: items,
    total: items.reduce((sum, expense) => sum + Number(expense.amount || 0), 0),
  }));
};

export default function AllExpensesPage({
  onLoadExpenses,
  onEditExpense,
  onDeleteExpense,
  onNavigate,
  onLogout,
  username = "Vansh",
}: AllExpensesPageProps) {
  // If no loader is connected, sampleExpenses keeps the page preview populated.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ExpenseCategory | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>("All Expenses");
  const navigate = useNavigate();
  const {
    getAllExpenses,
    searchExpense,
    deleteExpense,
    expenses,
    isLoading,
    error: loadError,
  } = useExpenseStore();
  useEffect(() => {
    const query = searchTerm.trim();

    const timer = setTimeout(
      () => {
        if (query.length >= 2) {
          searchExpense(query);
        } else {
          getAllExpenses();
        }
      },
      query.length >= 2 ? 400 : 0,
    );

    return () => clearTimeout(timer);
  }, [searchTerm, searchExpense, getAllExpenses]);

  const handleDeleteExpense = async (expenseId: string) => {
    await deleteExpense(expenseId);
  };

  // Filters expenses by search text and the selected category.
  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      return (
        selectedCategory === "all" || expense.category === selectedCategory
      );
    });
  }, [expenses, selectedCategory]);

  // Build date groups after filtering, so each date header total reflects visible matching expenses.
  const dateGroups = useMemo(
    () => groupExpensesByDate(filteredExpenses),
    [filteredExpenses],
  );

  const totalPages = Math.max(1, Math.ceil(dateGroups.length / PAGE_SIZE));

  // Keep the current page valid when the user changes search or category filters.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Selects only the date groups for the current page. A day's expenses are never split across pages.
  const visibleGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return dateGroups.slice(startIndex, startIndex + PAGE_SIZE);
  }, [dateGroups, currentPage]);

  // Handles search input changes.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Handles category filter changes.
  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value as ExpenseCategory | "all");
  };

  // Moves to the previous page of date groups.
  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  // Moves to the next page of date groups.
  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1));
  };

  // Sends the selected full expense object to the edit callback.
  const handleEdit = (expense: ExpenseRecord) => {
    setOpenMenuId(null);
    onEditExpense?.(expense);
  };

  // Sends the MongoDB expense ID to the delete callback.
  const handleDelete = (expenseId: string) => {
    setOpenMenuId(null);
    onDeleteExpense?.(expenseId);
  };

  // Handles sidebar navigation; route changes are owned by the parent component.
  const handleNavigation = (page: PageName) => {
    setActiveNav(page);
    setMobileNavOpen(false);

    switch (page) {
      case "Dashboard":
        navigate("/home");
        break;

      case "Add Expense":
        navigate("/add-expense");
        break;

      case "All Expenses":
        navigate("/all-expenses");
        break;
    }
  };

  // Delegates logout to the authentication store through the parent component.
  const handleLogout = () => onLogout?.();

  return (
    <main className="daypay-all-expenses">
      {mobileNavOpen && (
        <button
          className="all-expenses-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <SideBar
        activeNav={activeNav}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
      />

      <section className="all-expenses-main">
        <div className="all-expenses-content">
          <section className="all-expenses-toolbar">
            <div className="all-toolbar-intro">
              <span className="all-toolbar-icon">
                <ReceiptText size={34} strokeWidth={2.2} />
              </span>
              <div>
                <h2>All Expenses</h2>
                <p>Track and manage all your expenses in one place.</p>
              </div>
            </div>

            <div className="all-toolbar-controls">
              <label className="all-search-box">
                <Search size={21} />
                <input
                  type="search"
                  placeholder="Search expenses..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-label="Search expenses"
                />
              </label>

              <label className="all-category-filter">
                <SlidersHorizontal size={18} />
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  aria-label="Filter by category"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={15} />
              </label>
            </div>
          </section>

          {isLoading && (
            <div className="all-expenses-state">
              <span className="all-loading-spinner" />
              <p>Loading your expenses...</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div className="all-expenses-state error-state" role="alert">
              <p>{loadError}</p>
              <span>Check your API connection and try again.</span>
            </div>
          )}

          {!isLoading && !loadError && dateGroups.length === 0 && (
            <div className="all-expenses-state">
              <ReceiptText size={34} />
              <h3>No expenses found</h3>
              <p>
                {expenses.length === 0
                  ? "You haven't added any expenses yet."
                  : "Try changing your search or category filter."}
              </p>
            </div>
          )}

          {!isLoading && !loadError && visibleGroups.length > 0 && (
            <>
              <section
                className="all-expense-groups"
                aria-label="Expenses grouped by date"
              >
                {visibleGroups.map((group) => (
                  <article className="all-date-group" key={group.key}>
                    <header className="all-date-group-header">
                      <div className="all-date-label">
                        <CalendarDays size={20} strokeWidth={2.4} />
                        <h3>{group.label}</h3>
                      </div>
                      <strong>Total: {formatCurrency(group.total)}</strong>
                    </header>

                    <div className="all-date-expense-list">
                      {group.expenses.map((expense) => {
                        const CategoryIcon =
                          categoryIcons[expense.category] ?? CircleEllipsis;
                        const categoryClass = `cat-${expense.category}`;
                        const method =
                          paymentLabels[expense.paymentMethod ?? "other"];

                        return (
                          <div className="all-expense-row" key={expense._id}>
                            <span
                              className={`all-expense-category-icon ${categoryClass}`}
                            >
                              <CategoryIcon size={24} strokeWidth={2.2} />
                            </span>

                            <div className="all-expense-description">
                              <strong>{expense.title}</strong>
                              <span>
                                {expense.note?.trim() || "No description"}
                                <small className="all-payment-method">
                                  <span aria-hidden="true">·</span>
                                  <Smartphone size={12} />
                                  {method}
                                </small>
                              </span>
                            </div>

                            <strong className="all-expense-amount">
                              {formatCurrency(Number(expense.amount))}
                            </strong>

                            <span
                              className={`all-category-badge ${categoryClass}`}
                            >
                              {categoryLabels[expense.category]}
                            </span>

                            <time
                              className="all-expense-time"
                              dateTime={expense.date}
                            >
                              <Clock3 size={15} />
                              {formatExpenseTime(expense.date)}
                            </time>

                            <div className="all-row-menu-wrap">
                              <button
                                className="all-row-menu-button"
                                type="button"
                                aria-label={`Actions for ${expense.title}`}
                                aria-expanded={openMenuId === expense._id}
                                onClick={() =>
                                  setOpenMenuId((current) =>
                                    current === expense._id
                                      ? null
                                      : expense._id,
                                  )
                                }
                              >
                                <EllipsisVertical size={20} />
                              </button>

                              {openMenuId === expense._id && (
                                <div className="all-row-menu">
                                  <button
                                    type="button"
                                    onClick={() => handleEdit(expense)}
                                  >
                                    <Pencil size={14} /> Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteExpense(expense._id)}
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </section>

              {dateGroups.length > PAGE_SIZE && (
                <nav className="all-pagination" aria-label="Expenses pages">
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={21} />
                  </button>
                  <span className="pagination-current" aria-current="page">
                    {currentPage}
                  </span>
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <ChevronRight size={21} />
                  </button>
                  <span className="pagination-caption">
                    Page {currentPage} of {totalPages}
                  </span>
                </nav>
              )}
            </>
          )}

          <p className="all-expenses-footnote">
            Showing {filteredExpenses.length}{" "}
            {filteredExpenses.length === 1 ? "expense" : "expenses"}
            {expenses.length > 0 && ` out of ${expenses.length}`}
          </p>
        </div>
      </section>
    </main>
  );
}
