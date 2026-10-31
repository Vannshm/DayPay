import { ChevronDown, LogOut, Menu } from "lucide-react";

type HeaderProps = {
  setMobileNavOpen: (value: boolean) => void;
  displayName: string;
  profileOpen: boolean;
  setProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => void;
};


export const Header = ({ setMobileNavOpen ,
   displayName ,
    profileOpen ,
     setProfileOpen ,
      handleLogout } : HeaderProps )=>{

      return(    <header className="dashboard-topbar">
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
              onClick={() => setProfileOpen((prev) => !prev)}
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
        </header>)

}