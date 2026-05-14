import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Briefcase,
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageCircleMore,
  MessageSquare,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import "./Admin.css";
import logo from "../../assets/logo.png";
import { buildApiUrl } from "../../config/api";

const ADMIN_PROFILE_API = buildApiUrl("Admin/profile");
const ADMIN_PROFILE_STORAGE_KEY = "adminProfile";
const ADMIN_PROFILE_UPDATED_EVENT = "admin-profile-updated";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { path: "/admin/applications", label: "Applications", icon: Users },
  { path: "/admin/interviews", label: "Interviews", icon: CalendarDays },
  { path: "/admin/interview-feedback", label: "Feedback", icon: MessageCircleMore },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/users", label: "Users", icon: UserPlus },
];

const dropdownItems = [
  { label: "My Profile", icon: User, path: "/admin/profile" },
  { label: "Change Password", icon: LockKeyhole, path: "/admin/change-password" },
];

const getInitialProfile = () => {
  try {
    const storedProfile = JSON.parse(localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY) || "null");

    if (storedProfile) {
      return storedProfile;
    }
  } catch {
    // Ignore corrupted local profile cache.
  }

  return {
    username: "Admin",
    email: "admin@example.com",
    role: "Administrator",
  };
};

const getProfileInitial = (username = "") =>
  String(username || "A").trim().charAt(0).toUpperCase() || "A";

function AdminSidebar({ collapsed, mobileOpen, onToggle, onClose }) {
  return (
    <>
      <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-toggle-row">
          <button
            type="button"
            className="admin-icon-button sidebar-toggle-button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={21} />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.end}
                className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {mobileOpen ? <button type="button" className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={onClose} /> : null}
    </>
  );
}

function ProfileDropdown({ open, onNavigate, onLogout, profile }) {
  return (
    <div className={`admin-profile-dropdown ${open ? "open" : ""}`} role="menu" aria-hidden={!open}>
      <div className="admin-profile-dropdown-head">
        <span className="admin-avatar admin-avatar-large">{getProfileInitial(profile.username)}</span>
        <div>
          <strong>{profile.username || "Admin"}</strong>
          <span>{profile.role || "Administrator"}</span>
          <small>{profile.email || "admin@example.com"}</small>
        </div>
      </div>

      <div className="admin-profile-dropdown-list">
        {dropdownItems.map((item) => {
          const Icon = item.icon;

          return (
            <button key={item.label} type="button" role="menuitem" onClick={() => onNavigate(item.path)}>
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" className="admin-profile-signout" onClick={onLogout} role="menuitem">
        <LogOut size={18} aria-hidden="true" />
        <span>Sign Out</span>
      </button>
    </div>
  );
}

function AdminNavbar({ collapsed, onSidebarToggle, dropdownOpen, onDropdownToggle, profileRef, onNavigate, onLogout, profile }) {
  return (
    <header className={`admin-topbar ${collapsed ? "collapsed" : ""}`}>
      <div className="admin-topbar-left">
        <button
          type="button"
          className="admin-icon-button mobile-menu-btn"
          onClick={onSidebarToggle}
          aria-label="Toggle admin menu"
        >
          <Menu size={22} />
        </button>

        <img src={logo} alt="Pirnav Logo" className="admin-topbar-logo" />
      </div>

      <div className="admin-topbar-actions">
        <div className="admin-profile-menu" ref={profileRef}>
          <button
            type="button"
            className="admin-profile-trigger"
            onClick={onDropdownToggle}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            <span className="admin-avatar">{getProfileInitial(profile.username)}</span>
            <span className="admin-profile-copy">
              <strong>{profile.username || "Admin"}</strong>
              <small>{profile.email || "admin@example.com"}</small>
            </span>
            <ChevronDown size={18} className={dropdownOpen ? "rotate" : ""} aria-hidden="true" />
          </button>

          <ProfileDropdown open={dropdownOpen} onNavigate={onNavigate} onLogout={onLogout} profile={profile} />
        </div>
      </div>
    </header>
  );
}

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(getInitialProfile);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 900) {
      setMobileOpen((current) => !current);
      return;
    }

    setCollapsed((current) => !current);
  };

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const applyProfile = (nextProfile) => {
      setProfile((current) => ({
        ...current,
        ...nextProfile,
      }));
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        return;
      }

      try {
        const response = await fetch(ADMIN_PROFILE_API, {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json().catch(() => null);

        if (!response.ok || data?.success === false) {
          return;
        }

        const nextProfile = data?.data || data || {};
        const normalizedProfile = {
          username: nextProfile.username || nextProfile.Username || "Admin",
          email: nextProfile.email || nextProfile.Email || "admin@example.com",
          role: nextProfile.role || nextProfile.Role || "Administrator",
        };

        localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
        applyProfile(normalizedProfile);
      } catch {
        // Keep the cached profile if the API is temporarily unavailable.
      }
    };

    const handleProfileUpdated = (event) => {
      applyProfile(event.detail || getInitialProfile());
    };

    window.addEventListener(ADMIN_PROFILE_UPDATED_EVENT, handleProfileUpdated);
    fetchProfile();

    return () => {
      window.removeEventListener(ADMIN_PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    const handleClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className={`admin-container ${collapsed ? "sidebar-collapsed" : ""}`}>
      <AdminSidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggle={handleSidebarToggle}
        onClose={() => setMobileOpen(false)}
      />

      <AdminNavbar
        collapsed={collapsed}
        onSidebarToggle={handleSidebarToggle}
        dropdownOpen={profileOpen}
        onDropdownToggle={() => setProfileOpen((current) => !current)}
        profileRef={profileRef}
        onNavigate={(path) => {
          setProfileOpen(false);
          navigate(path);
        }}
        onLogout={handleLogout}
        profile={profile}
      />

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
