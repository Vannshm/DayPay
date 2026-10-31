import {
  Wallet,
  LayoutDashboard,
  CirclePlus,
  ReceiptText,
  Shapes,
  ChartNoAxesCombined,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";

import type { NavItem } from './NavItem'

  type SideBarProps = {
  activeNav: NavItem;
  mobileNavOpen: boolean;
  setMobileNavOpen: (value: boolean) => void;
  handleNavigation: (item: NavItem) => void;
  handleLogout: () => void;
};

const navigation = [
  { label: "Dashboard" as NavItem, icon: LayoutDashboard },
  { label: "Add Expense" as NavItem, icon: CirclePlus },
  { label: "All Expenses" as NavItem, icon: ReceiptText },
  { label: "Categories" as NavItem, icon: Shapes },
  { label: "Reports" as NavItem, icon: ChartNoAxesCombined },
];


export const SideBar = ({ activeNav , mobileNavOpen , setMobileNavOpen , handleNavigation , handleLogout } : SideBarProps)=>{
       return( <aside className={`dashboard-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
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
      </aside>)
}