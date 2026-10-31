import { useState, useEffect } from "react";
import { useExpenseStore } from "../expenseStore";
import type { ExpenseCategory, PaymentMethod } from "../expenseStore";
import {
  Wallet,
  LayoutDashboard,
  CirclePlus,
  ReceiptText,
  Shapes,
  ChartNoAxesCombined,
  LogOut,
  ChevronRight,
  ChevronDown,
  CreditCard,
  ShoppingBag,
  CarFront,
  House,
  HeartPulse,
  Clapperboard,
  GraduationCap,
  CircleEllipsis,
  Pencil,
  Trash2,
  Utensils,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import "./HomePage.css";

type NavItem =
  | "Dashboard"
  | "Add Expense"
  | "All Expenses"
  | "Categories"
  | "Reports";

type HomePageProps = {
  // TODO(authStore): Connect this to addExpense(), or open your Add Expense form/modal.
  onAddExpense?: () => void;
  // TODO(authStore): Connect this to deleteExpense(expenseId).
  onDeleteExpense?: (expenseId: string) => void;
  // TODO(authStore): Connect this to getExpense(expenseId) / open the Edit Expense form.
  onEditExpense?: (expenseId: string) => void;
  // TODO(authStore): Connect this to getAllExpense() or navigate to your All Expenses page.
  onViewAllExpenses?: () => void;
  // TODO(authStore): Connect this to logout() from your Zustand auth store.
  onLogout?: () => void;
  // TODO(router): Use this callback to navigate to Dashboard, All Expenses, Categories, or Reports.
  onNavigate?: (item: NavItem) => void;
};

const navigation: { label: NavItem; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Add Expense", icon: CirclePlus },
  { label: "All Expenses", icon: ReceiptText },
  { label: "Categories", icon: Shapes },
  { label: "Reports", icon: ChartNoAxesCombined },
];

// SAMPLE UI DATA: Replace these values with the response from your dashboard API.
const monthlyData = [
  { month: "Jan", amount: 2100 },
  { month: "Feb", amount: 4100 },
  { month: "Mar", amount: 5900 },
  { month: "Apr", amount: 4300 },
  { month: "May", amount: 4700 },
  { month: "Jun", amount: 3600 },
  { month: "Jul", amount: 3900 },
  { month: "Aug", amount: 6800 },
  { month: "Sep", amount: 5900 },
  { month: "Oct", amount: 5100 },
  { month: "Nov", amount: 4300 },
  { month: "Dec", amount: 3500 },
];

// SAMPLE UI DATA: Replace with getCategorySummary() response from authStore.
const categoryData: {
  name: ExpenseCategory;
  percent: number;
  color: string;
}[] = [
  { name: "Food", percent: 34, color: "#15966c" },
  { name: "Transport", percent: 21, color: "#5895f5" },
  { name: "Shopping", percent: 15, color: "#f4a000" },
  { name: "Bills", percent: 12, color: "#ef665b" },
  { name: "Entertainment", percent: 10, color: "#f39a3d" },
  { name: "Others", percent: 8, color: "#a44ab2" },
];

// Converts the backend paymentMethod enum into a readable label for the dashboard table.
const paymentMethodLabels: Record<PaymentMethod, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  bank_transfer: "Bank Transfer",
  other: "Other",
};

const categoryIcons: Record<ExpenseCategory, typeof Utensils> = {
  Food: Utensils,
  Transport: CarFront,
  Shopping: ShoppingBag,
  Bills: House,
  Entertainment: Clapperboard,
  Education: GraduationCap,
  Others: CircleEllipsis,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function HomePage({
  onAddExpense,
  onDeleteExpense,
  onEditExpense,
  onViewAllExpenses,
  onLogout,
  onNavigate,
}: HomePageProps) {
  const [activeNav, setActiveNav] = useState<NavItem>("Dashboard");
  const [period, setPeriod] = useState("This Year");
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { expenses, isLoading, error, getAllExpenses , summary , dashboard , deleteExpense } = useExpenseStore();
  useEffect(() => {
    getAllExpenses();
    dashboard();
  }, [getAllExpenses,dashboard]);
  

  const recentExpenses = expenses.slice(0, 5);

  // TODO(authStore): Read the logged-in user's username from useAuthStore().
  const displayName = "Vansh";

  // TODO(authStore): Replace these sample totals with dashBoardExpenseCount() response.
  const dashboardStats = {
    totalExpenses: summary?.totalExpenses ?? 0,
    totalTransactions: summary?.expenseCount ?? 0,
    highestCategory: "Food",
    highestCategoryAmount: 4200,
    remaining: 7550,
  };

  // Handles sidebar selection; connect onNavigate to React Router navigation when routes are ready.
  const handleNavigation = (item: NavItem) => {
    setActiveNav(item);
    setMobileNavOpen(false);

    if (item === "Add Expense") {
      // TODO(authStore): Call your add-expense action or open the Add Expense modal here.
      onAddExpense?.();
      return;
    }

    // TODO(router): Navigate to the selected page (Dashboard / All Expenses / Categories / Reports).
    onNavigate?.(item);
  };

  // Handles the Add Expense button; connect this to your addExpense flow in authStore.
  const handleAddExpense = () => {
    onAddExpense?.();
  };

  // Handles the View All action; connect this to getAllExpense() or your expenses route.
  const handleViewAllExpenses = () => {
    onViewAllExpenses?.();
  };

  // Handles editing a row; pass the selected expense ID to your editExpense flow.
  const handleEditExpense = (expenseId: string) => {
    onEditExpense?.(expenseId);
  };

  // Handles deleting a row; pass the selected expense ID to deleteExpense(expenseId).
  const handleDeleteExpense = async(expenseId: string) => {
   await deleteExpense(expenseId);
  };

  // Handles logout; connect this to logout() from your Zustand auth store.
  const handleLogout = () => {
    onLogout?.();
  };

  const maxMonthlyAmount = Math.max(...monthlyData.map((item) => item.amount));

  return (
    <main className="daypay-dashboard">
      {mobileNavOpen && (
        <button
          className="dashboard-mobile-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside className={`dashboard-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="dashboard-brand">
          <span className="dashboard-brand-icon">
            <Wallet size={25} strokeWidth={2.6} />
          </span>
          <span>DayPay</span>
          <button
            className="sidebar-close-button"
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <nav className="dashboard-nav" aria-label="Main navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              className={`dashboard-nav-item ${activeNav === label ? "active" : ""}`}
              key={label}
              type="button"
              onClick={() => handleNavigation(label)}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{label}</span>
              {activeNav === label && (
                <ChevronRight className="nav-chevron" size={16} />
              )}
            </button>
          ))}
        </nav>

        <button
          className="dashboard-logout"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </aside>

      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button
            className="mobile-menu-button"
            type="button"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={21} />
          </button>
          <div className="dashboard-greeting">
            <h1>
              Hello, {displayName} <span aria-hidden="true">👋</span>
            </h1>
            <p>Here's what's happening with your money today.</p>
          </div>

          <div className="dashboard-profile-wrap">
            <button
              className="dashboard-profile"
              type="button"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="profile-avatar">
                {displayName.charAt(0).toUpperCase()}
              </span>
              <span className="profile-name">{displayName}</span>
              <ChevronDown size={15} />
            </button>
            {profileOpen && (
              <div className="profile-menu">
                <div className="profile-menu-user">
                  <span className="profile-avatar">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <strong>{displayName}</strong>
                    <small>DayPay account</small>
                  </span>
                </div>
                <button type="button" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="dashboard-content">
          <section
            className="dashboard-stat-grid"
            aria-label="Expense overview"
          >
            <article className="stat-card">
              <span className="stat-icon stat-icon-red">
                <ReceiptText size={18} />
              </span>
              <div className="stat-copy">
                <p>Total Expenses</p>
                <strong>{formatCurrency(dashboardStats.totalExpenses)}</strong>
                <small>This month</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-blue">
                <CreditCard size={18} />
              </span>
              <div className="stat-copy">
                <p>Total Transactions</p>
                <strong>{dashboardStats.totalTransactions}</strong>
                <small>This month</small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-orange">
                <ShoppingBag size={18} />
              </span>
              <div className="stat-copy">
                <p>Highest Spending</p>
                <strong className="stat-category">
                  {dashboardStats.highestCategory}
                </strong>
                <small>
                  {formatCurrency(dashboardStats.highestCategoryAmount)}
                </small>
              </div>
            </article>
            <article className="stat-card">
              <span className="stat-icon stat-icon-green">
                <Utensils size={18} />
              </span>
              <div className="stat-copy">
                <p>Remaining (approx)</p>
                <strong>{formatCurrency(dashboardStats.remaining)}</strong>
                <small>This month</small>
              </div>
            </article>
          </section>

          <section className="dashboard-visual-grid">
            <article className="dashboard-card monthly-card">
              <div className="card-heading">
                <div>
                  <h2>Monthly Spending Summary</h2>
                </div>
                <label className="period-select-wrap">
                  <span className="sr-only">Spending period</span>
                  <select
                    value={period}
                    onChange={(event) => setPeriod(event.target.value)}
                  >
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                  <ChevronDown size={13} />
                </label>
              </div>
              <div className="monthly-chart">
                <div className="chart-y-labels" aria-hidden="true">
                  <span>10k</span>
                  <span>8k</span>
                  <span>6k</span>
                  <span>4k</span>
                  <span>2k</span>
                  <span>0</span>
                </div>
                <div className="chart-plot">
                  <div className="chart-grid-lines">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="chart-bars">
                    {monthlyData.map((item) => (
                      <div
                        className="chart-bar-column"
                        key={item.month}
                        title={`${item.month}: ${formatCurrency(item.amount)}`}
                      >
                        <div
                          className="chart-bar"
                          style={{
                            height: `${(item.amount / maxMonthlyAmount) * 100}%`,
                          }}
                        />
                        <span>{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            <article className="dashboard-card category-card">
              <div className="card-heading">
                <h2>Category Summary</h2>
              </div>
              <div className="category-content">
                <div
                  className="category-donut"
                  role="img"
                  aria-label="Category spending breakdown"
                  style={{
                    background: `conic-gradient(${categoryData
                      .map((item, index) => {
                        const start = categoryData
                          .slice(0, index)
                          .reduce((sum, category) => sum + category.percent, 0);
                        return `${item.color} ${start}% ${start + item.percent}%`;
                      })
                      .join(", ")})`,
                  }}
                >
                  <div className="donut-center">
                    <span>Total</span>
                    <strong>
                      {formatCurrency(dashboardStats.totalExpenses)}
                    </strong>
                  </div>
                </div>
                <div className="category-legend">
                  {categoryData.map((category) => (
                    <div className="legend-row" key={category.name}>
                      <span
                        className="legend-dot"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="legend-name">{category.name}</span>
                      <strong>{category.percent}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="dashboard-card recent-card">
            <div className="card-heading recent-heading">
              <h2>Recent Expenses</h2>
              <button
                className="view-all-button"
                type="button"
                onClick={handleViewAllExpenses}
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="expense-table-wrap">
              {isLoading ? (
                <p>Loading expenses...</p>
              ) : error ? (
                <p>{error}</p>
              ) : recentExpenses.length === 0 ? (
                <p>No expenses found. Add your first expense!</p>
              ) : (
                <table className="expense-table">
                  {/* Keep your existing thead here */}

                  <tbody>
                    {recentExpenses.map((expense) => {
                      const CategoryIcon =
                        categoryIcons[expense.category] ?? CircleEllipsis;

                      return (
                        <tr key={expense._id}>
                          <td className="expense-date">{expense.date}</td>

                          <td className="expense-description-cell">
                            <span className="expense-description">
                              {expense.title}
                            </span>

                            <span className="expense-note">
                              {expense.note || "No note added"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`expense-category category-${expense.category.toLowerCase()}`}
                            >
                              <CategoryIcon size={13} />
                              {expense.category}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`payment-method-badge payment-${expense.paymentMethod}`}
                            >
                              {paymentMethodLabels[expense.paymentMethod]}
                            </span>
                          </td>

                          <td className="expense-amount">
                            {formatCurrency(expense.amount)}
                          </td>

                          <td>
                            <div className="expense-actions">
                              <button
                                type="button"
                                onClick={() => handleEditExpense(expense._id)}
                              >
                                <Pencil size={14} />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(expense._id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
