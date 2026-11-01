import {
  WalletCards,
  LayoutDashboard,
  CirclePlus,
  ReceiptText,
  Shapes,
  ChartNoAxesCombined,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock3,
  Construction,
  type LucideIcon,
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./ComingSoonPage.css";
import { SideBar } from "../Home/SideBar";
import type { NavItem } from "../Home/NavItem";
import { useState } from "react";

export type ComingSoonFeature = {
  // Short feature title displayed in a planned-feature card.
  title: string;
  // One-line explanation displayed below the feature title.
  description: string;
  // Icon displayed beside the feature.
  icon: LucideIcon;
};

export type ComingSoonContent = {
  // Small label displayed above the main heading.
  eyebrow: string;
  // Main headline for this specific page.
  title: string;
  // Supporting headline below the main heading.
  subtitle: string;
  // Short explanation of what the page will offer.
  description: string;
  // Determines which sidebar link is highlighted.
  pageName: "Categories" | "Reports";
  // Three planned features displayed below the hero.
  features: ComingSoonFeature[];
  // Optional text for the development-status badge.
  statusLabel?: string;
};

type ComingSoonPageProps = {
  // TODO(authStore): Pass the logged-in username from useAuthStore().
  username?: string;
  // TODO(authStore): Pass your Zustand logout() function.
  onLogout?: () => void;
  // Pass categoriesContent or reportsContent to reuse this component.
  content: ComingSoonContent;
};

const navigation: { label: string; path: string; icon: LucideIcon }[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Add Expense", path: "/add-expense", icon: CirclePlus },
  { label: "All Expenses", path: "/all-expenses", icon: ReceiptText },
  { label: "Categories", path: "/categories", icon: Shapes },
  { label: "Reports", path: "/reports", icon: ChartNoAxesCombined },
];

export default function ComingSoonPage({
  onLogout,
  content,
}: ComingSoonPageProps) {
  // Delegates logout to the function passed from the parent route.
  const handleLogout = () => onLogout?.();
  const [activeNav, setActiveNav] = useState<NavItem>(content.pageName);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

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

      case "All Expenses":
        navigate("/all-expenses");
        break;

      case "Categories":
        navigate("/categories");
        break;

      case "Reports":
        navigate("/reports");
        break;
    }
  };

  return (
    <main className="daypay-coming-page">
      <SideBar
        activeNav={activeNav}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
        handleNavigation={handleNavigation}
        handleLogout={handleLogout}
      />

      <section className="coming-main">
        <div className="coming-content">
          <section className="coming-hero-card">
            <div className="coming-hero-copy">
              <span className="coming-status">
                <Construction size={14} />
                {content.statusLabel ?? "UNDER DEVELOPMENT"}
              </span>
              <p className="coming-eyebrow">{content.eyebrow}</p>
              <h2>{content.title}</h2>
              <h3>{content.subtitle}</h3>
              <p className="coming-description">{content.description}</p>
              <Link className="coming-back-button" to="/home">
                <ArrowLeft size={16} />
                Back to Dashboard
              </Link>
            </div>

            <div className="coming-visual" aria-hidden="true">
              <div className="coming-visual-glow" />
              <div className="coming-orbit orbit-one" />
              <div className="coming-orbit orbit-two" />
              <div className="coming-main-icon">
                <Sparkles size={43} strokeWidth={1.7} />
              </div>
              <span className="coming-float float-check">
                <CheckCircle2 size={21} />
              </span>
              <span className="coming-float float-clock">
                <Clock3 size={21} />
              </span>
              <span className="coming-spark spark-one">✦</span>
              <span className="coming-spark spark-two">✧</span>
              <div className="coming-visual-caption">
                A better way to understand your money
              </div>
            </div>
          </section>

          <section className="coming-features-section">
            <div className="coming-section-heading">
              <div>
                <p>WHAT'S IN THE WORKS</p>
                <h2>Here's what we're planning</h2>
              </div>
              <span className="coming-feature-count">3 planned features</span>
            </div>

            <div className="coming-feature-grid">
              {content.features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <article className="coming-feature-card" key={feature.title}>
                    <span
                      className={`coming-feature-icon feature-icon-${index + 1}`}
                    >
                      <FeatureIcon size={21} strokeWidth={2} />
                    </span>
                    <div>
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <footer className="coming-footer">
            <span className="coming-footer-mark">
              <WalletCards size={17} />
            </span>
            <p>Good things take time. Thanks for growing with DayPay.</p>
            <span className="coming-footer-note">
              DAYPAY · SMARTER MONEY HABITS
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
}
