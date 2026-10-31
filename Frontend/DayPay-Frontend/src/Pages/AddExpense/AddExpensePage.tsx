import { useState, type FormEvent, type ChangeEvent } from "react";
import {
  WalletCards,
  LayoutDashboard,
  CirclePlus,
  ReceiptText,
  Shapes,
  ChartNoAxesCombined,
  LogOut,
  Utensils,
  BusFront,
  ShoppingBag,
  Zap,
  Gamepad2,
  CalendarDays,
  Plus,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  TrendingUp,
  Ellipsis,
  ChevronDown,
  Menu,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  Smartphone,
  CreditCard,
  Banknote,
  Landmark,
} from "lucide-react";
import { SideBar } from "../Home/SideBar";
import { Header } from "../Home/Header";
import type { NavItem } from "../Home/NavItem";
import { useNavigate } from "react-router-dom";
import "./AddExpensePage.css";

type ExpenseCategory =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "health"
  | "entertainment"
  | "education"
  | "other";
type PaymentMethod = "cash" | "card" | "upi" | "bank_transfer" | "other";

type ExpensePayload = {
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note: string;
  paymentMethod: PaymentMethod;
};

type FormValues = Omit<ExpensePayload, "amount"> & { amount: string };

type AddExpensePageProps = {
  // TODO(authStore): Pass your Zustand addExpense function here; it receives the complete expense payload.
  onAddExpense?: (expense: ExpensePayload) => Promise<void> | void;
  // TODO(router): Connect this callback to the Dashboard / All Expenses / Categories / Reports routes.
  onNavigate?: (page: NavItem) => void;
  // TODO(authStore): Connect this callback to the logout() action in your authentication store.
  onLogout?: () => void;
  // TODO(authStore): Replace this prop with the logged-in username from useAuthStore().
  username?: string;
};

type RecentExpense = {
  id: string;
  category: ExpenseCategory;
  note: string;
  date: string;
  amount: number;
  icon: typeof Utensils;
};

// SAMPLE DATA: Replace this list with the latest items returned by getAllExpense() in authStore.
const sampleRecentExpenses: RecentExpense[] = [
  {
    id: "sample-1",
    category: "food",
    note: "Lunch at cafe",
    date: "10 Nov, 2025",
    amount: 250,
    icon: Utensils,
  },
  {
    id: "sample-2",
    category: "transport",
    note: "Bus fare",
    date: "09 Nov, 2025",
    amount: 40,
    icon: BusFront,
  },
  {
    id: "sample-3",
    category: "shopping",
    note: "New Shoes",
    date: "08 Nov, 2025",
    amount: 1999,
    icon: ShoppingBag,
  },
  {
    id: "sample-4",
    category: "bills",
    note: "Electricity Bill",
    date: "07 Nov, 2025",
    amount: 1200,
    icon: Zap,
  },
  {
    id: "sample-5",
    category: "entertainment",
    note: "Movie Ticket",
    date: "06 Nov, 2025",
    amount: 300,
    icon: Gamepad2,
  },
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

const paymentOptions: {
  value: PaymentMethod;
  label: string;
  icon: typeof WalletCards;
}[] = [
  { value: "upi", label: "UPI", icon: Smartphone },
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "card", label: "Card", icon: CreditCard },
  { value: "bank_transfer", label: "Bank Transfer", icon: Landmark },
  { value: "other", label: "Other", icon: WalletCards },
];

// Returns today's local date in the YYYY-MM-DD format required by input[type="date"].
const getTodayDate = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
};

const initialValues: FormValues = {
  title: "",
  amount: "",
  category: "food",
  date: getTodayDate(),
  note: "",
  paymentMethod: "upi",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export default function AddExpensePage({
  onAddExpense,
  onNavigate,
  onLogout,
  username = "Vansh",
}: AddExpensePageProps) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<NavItem>("Add Expense");
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = username;

  // Updates one controlled form field and clears stale feedback as the user edits.
  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setFormError("");
    setFormSuccess("");
  };

  // Clears the form and restores its default category, payment method, and today's date.
  const handleReset = () => {
    setValues({ ...initialValues, date: getTodayDate() });
    setFormError("");
    setFormSuccess("");
  };

  // Validates the form, converts amount to a number, and calls the future Zustand addExpense action.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!values.title.trim()) {
      setFormError("Please enter an expense title.");
      return;
    }

    const amount = Number(values.amount);
    if (!values.amount || !Number.isFinite(amount) || amount <= 0) {
      setFormError("Please enter an amount greater than zero.");
      return;
    }

    if (!values.date) {
      setFormError("Please select an expense date.");
      return;
    }

    if (!onAddExpense) {
      setFormError(
        "Connect your addExpense function from authStore to save this expense.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onAddExpense({
        title: values.title.trim(),
        amount,
        category: values.category,
        date: values.date,
        note: values.note.trim(),
        paymentMethod: values.paymentMethod,
      });
      setFormSuccess("Expense added successfully.");
      setValues({ ...initialValues, date: getTodayDate() });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to add this expense. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Closes the mobile drawer and delegates page changes to the parent router.
  const handleNavigation = (page: NavItem) => {
    setActiveNav(page);
    setMobileNavOpen(false);

    switch (page) {
      case "Dashboard":
        navigate("/home");
        break;

      case "Add Expense":
        navigate("/add-expense");
        break;
    }
  };

  // Delegates logout to the authentication store through the parent component.
  const handleLogout = () => onLogout?.();

  return (
    <main className="daypay-add-page">
      {mobileNavOpen && (
        <button
          className="add-mobile-backdrop"
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

      <section className="add-main">
        <Header
          setMobileNavOpen={setMobileNavOpen}
          displayName={displayName}
          profileOpen={profileOpen}
          setProfileOpen={setProfileOpen}
          handleLogout={handleLogout}
        />

        <div className="add-page-content">
          <section className="add-layout-grid">
            <article className="add-form-card">
              <div className="add-form-banner">
                <div className="banner-plus">
                  <Plus size={34} strokeWidth={1.8} />
                </div>
                <div className="banner-copy">
                  <h2>Add Expense</h2>
                  <p>Track your expense in just a few clicks</p>
                </div>
                <div className="banner-wallet-art" aria-hidden="true">
                  <span className="wallet-spark spark-a" />
                  <span className="wallet-spark spark-b" />
                  <WalletCards
                    className="banner-wallet-icon"
                    size={132}
                    strokeWidth={1.3}
                  />
                  <span className="banner-coin">₹</span>
                  <span className="wallet-leaf leaf-a" />
                  <span className="wallet-leaf leaf-b" />
                </div>
              </div>

              <form
                className="add-expense-form"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="add-fields-grid">
                  <div className="add-field">
                    <label htmlFor="expense-title">
                      Title <span>*</span>
                    </label>
                    <div className="add-input-wrap">
                      <span className="input-icon">
                        <ReceiptText size={17} />
                      </span>
                      <input
                        id="expense-title"
                        name="title"
                        type="text"
                        placeholder="e.g. Grocery Shopping"
                        value={values.title}
                        onChange={handleChange}
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="add-field">
                    <label htmlFor="expense-amount">
                      Amount <span>*</span>
                    </label>
                    <div className="add-input-wrap">
                      <span className="input-icon rupee-icon">
                        <IndianRupee size={17} />
                      </span>
                      <input
                        id="expense-amount"
                        name="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Enter amount"
                        value={values.amount}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="add-field">
                    <label htmlFor="expense-category">
                      Category <span>*</span>
                    </label>
                    <div className="add-input-wrap select-input-wrap">
                      <span className="input-icon">
                        <Utensils size={17} />
                      </span>
                      <select
                        id="expense-category"
                        name="category"
                        value={values.category}
                        onChange={handleChange}
                      >
                        <option value="food">Food</option>
                        <option value="transport">Transport</option>
                        <option value="shopping">Shopping</option>
                        <option value="bills">Bills</option>
                        <option value="health">Health</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="select-chevron" size={16} />
                    </div>
                  </div>

                  <div className="add-field">
                    <label htmlFor="expense-date">
                      Date <span>*</span>
                    </label>
                    <div className="add-input-wrap date-input-wrap">
                      <span className="input-icon">
                        <CalendarDays size={17} />
                      </span>
                      <input
                        id="expense-date"
                        name="date"
                        type="date"
                        value={values.date}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="add-field payment-field">
                  <label htmlFor="expense-payment">Payment Method</label>
                  <div className="add-input-wrap select-input-wrap">
                    <span className="input-icon">
                      <WalletCards size={17} />
                    </span>
                    <select
                      id="expense-payment"
                      name="paymentMethod"
                      value={values.paymentMethod}
                      onChange={handleChange}
                    >
                      {paymentOptions.map((option) => (
                        <option value={option.value} key={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="select-chevron" size={16} />
                  </div>
                  {/* TODO(authStore): Include this selected value as paymentMethod in the addExpense request. */}
                </div>

                <div className="add-field note-field">
                  <label htmlFor="expense-note">
                    Description{" "}
                    <span className="optional-label">(Optional)</span>
                  </label>
                  <textarea
                    id="expense-note"
                    name="note"
                    placeholder="Add a note about this expense..."
                    value={values.note}
                    onChange={handleChange}
                    maxLength={500}
                    rows={3}
                  />
                  <span className="note-counter">{values.note.length}/500</span>
                  {/* TODO(authStore): Description in this UI maps to the backend's note field. */}
                </div>

                {formError && (
                  <div className="add-form-message error" role="alert">
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="add-form-message success" role="status">
                    <CheckCircle2 size={16} />
                    <span>{formSuccess}</span>
                  </div>
                )}

                <div className="add-form-actions">
                  <button
                    className="reset-expense-button"
                    type="button"
                    onClick={handleReset}
                  >
                    <RotateCcw size={17} /> Reset
                  </button>
                  <button
                    className="submit-expense-button"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="add-button-spinner" />
                    ) : (
                      <Plus size={20} />
                    )}
                    {isSubmitting ? "Adding Expense..." : "Add Expense"}
                  </button>
                </div>
              </form>
            </article>

            <div className="add-right-column">
              <article className="recent-expenses-card">
                <div className="recent-expenses-heading">
                  <div className="recent-title">
                    <ReceiptText size={25} strokeWidth={2} />
                    <h2>Recent Expenses</h2>
                  </div>
                  <button
                    className="recent-view-all"
                    type="button"
                    onClick={() => onNavigate?.("All Expenses")}
                  >
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                <div className="recent-expenses-list">
                  {sampleRecentExpenses.map((expense) => {
                    const CategoryIcon = expense.icon;
                    return (
                      <div className="recent-expense-row" key={expense.id}>
                        <span
                          className={`recent-category-icon icon-${expense.category}`}
                        >
                          <CategoryIcon size={24} strokeWidth={2.2} />
                        </span>
                        <div className="recent-expense-info">
                          <strong>{categoryLabels[expense.category]}</strong>
                          <span>{expense.note}</span>
                        </div>
                        <div className="recent-expense-date">
                          <CalendarDays size={16} />
                          <span>{expense.date}</span>
                        </div>
                        <strong className="recent-expense-amount">
                          − {formatCurrency(expense.amount)}
                        </strong>
                        <button
                          className="recent-more-button"
                          type="button"
                          aria-label={`More options for ${categoryLabels[expense.category]}`}
                          title="More options"
                        >
                          <Ellipsis size={19} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </article>

              <aside className="add-pro-tip">
                <div className="tip-icon">
                  <Lightbulb size={23} />
                </div>
                <div className="tip-copy">
                  <h3>Pro Tip!</h3>
                  <p>
                    Try to add expenses regularly to get better insights into
                    your spending habits.
                  </p>
                </div>
                <div className="tip-chart" aria-hidden="true">
                  <TrendingUp
                    className="tip-trend-line"
                    size={64}
                    strokeWidth={1.8}
                  />
                  <div className="tip-bars">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
