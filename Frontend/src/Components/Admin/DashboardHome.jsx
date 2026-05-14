import { useEffect, useState } from "react";
import {
  MessageSquare,
  Briefcase,
  Users,
  ArrowUpRight,
  ClipboardCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
 
const BASE_URL = buildApiUrl("Admin");
 
const DashboardHome = () => {
  const navigate = useNavigate();
 
  const [stats, setStats] = useState({
    messages: 0,
    jobs: 0,
    applications: 0,
  });
 
  const [loading, setLoading] = useState(true);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
 
  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    };
  };
 
  useEffect(() => {
    fetchSummary();
    fetchRecentMessages();
    fetchRecentApplications();
  }, []);
 
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/dashboard-summary`, {
        headers: getHeaders(),
      });
      if (res.status === 401) {
        navigate("/admin-login");
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard summary");
      }
      const response = await res.json();
      console.log("Dashboard summary:", response);
      const summary = response?.data || {};
      setStats({
        messages: summary.unreadMessages ?? 0,
        jobs: summary.openPositions ?? 0,
        applications: summary.pendingReviews ?? 0,
      });
    } catch (err) {
      console.error("Dashboard summary error:", err);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchRecentMessages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/recent-messages`, {
        headers: getHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      console.log("Recent messages:", data);
      setRecentMessages(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Recent messages error:", err);
    }
  };
 
  const fetchRecentApplications = async () => {
    try {
      const res = await fetch(`${BASE_URL}/recent-applications`, {
        headers: getHeaders(),
      });
      if (res.status === 401) {
        navigate("/admin-login");
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      console.log("Recent applications:", data);
      setRecentApplications(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Recent applications error:", err);
    }
  };
 
  const formatDate = (date) => {
    if (!date) return "No Date";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statCards = [
    {
      key: "messages",
      label: "Unread Messages",
      value: stats.messages,
      hint: "Needs review",
      icon: MessageSquare,
      className: "messages-card",
      path: "/admin/messages",
    },
    {
      key: "jobs",
      label: "Open Positions",
      value: stats.jobs,
      hint: "Active jobs",
      icon: Briefcase,
      className: "jobs-card",
      path: "/admin/jobs",
    },
    {
      key: "applications",
      label: "Pending Reviews",
      value: stats.applications,
      hint: "Need review",
      icon: ClipboardCheck,
      className: "applications-card",
      path: "/admin/applications",
    },
  ];
 
  return (
<div className="dashboard-wrapper">
<div className="dashboard-header">
<h1>Dashboard</h1>
</div>
 
<div className="stats-grid">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.key}
              className={`stat-card ${card.className}`}
              onClick={() => navigate(card.path)}
            >
              <div className="stat-heading-row">
                <span className="stat-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <p className="stat-title">{card.label}</p>
              </div>
              <div className="stat-body">
                <h2>{loading ? "Loading..." : card.value}</h2>
                <span className="stat-trend">{card.hint}</span>
              </div>
            </div>
          );
        })}
</div>
 
<div className="dashboard-bottom">
<div className="dashboard-card">
<div className="card-header">
<h3>Recent Messages</h3>
<button onClick={() => navigate("/admin/messages")}>
              View All <ArrowUpRight size={14} />
</button>
</div>
          {recentMessages.length === 0 && <p>No recent messages</p>}
          {recentMessages.map((msg, index) => (
<div key={index} className="list-item">
<div className="list-avatar">{msg.name?.charAt(0)}</div>
              <div className="list-content">
<strong>{msg.name}</strong>
<p>{msg.subject}</p>
<small>{msg.message}</small>
</div>
              <span className="date">{formatDate(msg.date)}</span>
</div>
          ))}
</div>
 
<div className="dashboard-card">
<div className="card-header">
<h3>Recent Applications</h3>
<button onClick={() => navigate("/admin/applications")}>
              View All <ArrowUpRight size={14} />
</button>
</div>
          {recentApplications.length === 0 && (
<p>No recent applications</p>
          )}
          {recentApplications.map((app, index) => (
<div key={index} className="list-item">
<div className="list-avatar">{app.name?.charAt(0)}</div>
              <div className="list-content">
<strong>{app.name}</strong>
<p>{app.position}</p>
</div>
              <span className={`status ${String(app.status || "").toLowerCase()}`}>{app.status}</span>
</div>
          ))}
</div>
</div>
</div>
  );
};
 
export default DashboardHome;
