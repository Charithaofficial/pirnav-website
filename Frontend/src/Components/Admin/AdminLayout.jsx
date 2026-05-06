import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  CircleUserRound,
  LayoutDashboard,
  MessageSquare,
  Briefcase,
  Users,
  CalendarDays,
  MessageCircleMore,
  LogOut,
  Menu,
} from "lucide-react";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import "./Admin.css";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
  { path: "/admin/applications", label: "Applications", icon: Users },
  { path: "/admin/interviews", label: "Interviews", icon: CalendarDays },
  { path: "/admin/interview-feedback", label: "Feedback", icon: MessageCircleMore },
  { path: "/admin/users", label: "Admin Users", icon: UserPlus },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin-login");
  };

  const activeNavItem =
    navItems.find((item) =>
      item.path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.path)
    ) || navItems[0];
  const showTopbarProfile = location.pathname === "/admin";

  return (
    <div className="admin-container">
      <aside className={`admin-sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-icon" aria-hidden="true">P</div>
          <div>
            <h4>Pirnav Admin Dashboard</h4>
            <small>Management Console</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button type="button" className="sidebar-logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle admin menu"
            >
              <Menu size={18} />
            </button>
            <h1 className="admin-topbar-title">{activeNavItem.label}</h1>
          </div>

          {showTopbarProfile ? (
            <div className="admin-topbar-profile" aria-label="Admin profile">
              <span className="admin-topbar-profile-icon" aria-hidden="true">
                <CircleUserRound size={20} />
              </span>
              <small>Admin</small>
            </div>
          ) : null}
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
