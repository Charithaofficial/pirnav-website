import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Eye,
  Clock,
  Bookmark,
  X,
  XCircle,
  CircleDot,
  Trash2,
} from "lucide-react";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
 
const API_BASE = buildApiUrl("JobApplications");
 
const statusConfig = {
  pending: { label: "Pending", icon: Clock },
  reviewed: { label: "Reviewed", icon: CircleDot },
  shortlisted: { label: "Shortlisted", icon: Bookmark },
  rejected: { label: "Rejected", icon: XCircle },
};

const statusOptions = ["pending", "reviewed", "shortlisted", "rejected"];

const formatShortDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
 
const Applications = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [deleteApplication, setDeleteApplication] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState("");
 
  const token = localStorage.getItem("adminToken");
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  };
 
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch(API_BASE, { headers });
        if (res.status === 401) {
          console.error("Unauthorized. Login again.");
          return;
        }
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.applications || data.data || [];
        const normalized = list.map((a) => ({
          id: a.id,
          name: a.name,
          email: a.email,
          jobTitle: a.jobTitle,
          status: a.status?.toLowerCase(),
          appliedDate: a.appliedDate,
        }));
        setApplications(normalized);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
 
    if (token) {
      fetchApplications();
    }
  }, [token]);

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || a.status === filter;
    return matchSearch && matchFilter;
  });
 
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/status`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("Status update failed");
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      if (selected?.id === id) {
        setSelected({ ...selected, status });
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteApplication) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/${deleteApplication.id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setApplications((prev) =>
        prev.filter((application) => application.id !== deleteApplication.id)
      );

      if (selected?.id === deleteApplication.id) {
        closeModal();
      }

      setDeleteApplication(null);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
 
  const openResumeInNewTab = async (id) => {
    setResumeError("");
    const previewTab = window.open("about:blank", "_blank");
    if (!previewTab) {
      setResumeError("Please allow popups to view the resume.");
      return;
    }
    previewTab.document.write(
      "<p style='font-family:Segoe UI,sans-serif;padding:24px;'>Opening resume...</p>"
    );
    previewTab.document.close();
    setResumeLoading(true);
    try {
      const response = await fetch(`${API_BASE}/view/${id}`, {
        method: "GET",
        headers,
      });
      if (!response.ok) throw new Error("Resume fetch failed");
      const blob = await response.blob();
      const contentType =
        response.headers.get("content-type") || blob.type || "application/pdf";
      const resumeBlob =
        blob.type === contentType ? blob : blob.slice(0, blob.size, contentType);
      const url = window.URL.createObjectURL(resumeBlob);
      previewTab.location.href = url;
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      console.error("Resume view error:", error);
      previewTab.document.open();
      previewTab.document.write(
        "<p style='font-family:Segoe UI,sans-serif;padding:24px;color:#b91c1c;'>Resume is not available right now.</p>"
      );
      previewTab.document.close();
      setResumeError("Resume is not available right now.");
    } finally {
      setResumeLoading(false);
    }
  };

  const openApplication = (application) => {
    setSelected(application);
    setResumeError("");
    setResumeLoading(false);
  };

  const closeModal = () => {
    setSelected(null);
    setResumeError("");
    setResumeLoading(false);
  };
 
  return (
<div className="applications-wrapper">
<div className="applications-header">
<h1>Applications</h1>
</div>
 
      <div className="summary-grid">
        {statusOptions.map((status) => {
          const count = applications.filter((a) => a.status === status).length;
          const Icon = statusConfig[status].icon;
          return (
<div
              key={status}
              className={`summary-card summary-card-${status} ${filter === status ? "active" : ""}`}
              onClick={() => setFilter(filter === status ? "all" : status)}
>
              <div className="summary-card-icon" aria-hidden="true">
<Icon size={18} />
</div>
              <div className="summary-card-copy">
<h2>{count}</h2>
<p>{statusConfig[status].label}</p>
</div>
</div>
          );
        })}
</div>
 
      <div className="filter-bar">
        <div className="search-box">
<Search size={14} />
<input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
</div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
<option value="all">All Status</option>
<option value="pending">Pending</option>
<option value="reviewed">Reviewed</option>
<option value="shortlisted">Shortlisted</option>
<option value="rejected">Rejected</option>
</select>
</div>
 
      <table className="applications-table">
<thead>
<tr>
<th>Candidate</th>
<th>Position</th>
<th>Status</th>
<th>Applied</th>
<th>Action</th>
</tr>
</thead>
        <tbody>
          {filtered.map((app) => (
<tr key={app.id}>
<td>
<strong>{app.name}</strong>
<br />
<small>{app.email}</small>
</td>
              <td>{app.jobTitle}</td>
              <td>
<span className={`status ${app.status}`}>
                  {statusConfig[app.status]?.label}
</span>
</td>
              <td>
                <span className="table-date">{formatShortDate(app.appliedDate)}</span>
</td>
              <td className="table-actions-cell">
                <div className="table-action-group">
<button type="button" className="table-icon-btn" onClick={() => openApplication(app)}>
<Eye size={14} />
</button>
                  <button type="button" className="table-icon-btn table-icon-btn-danger" onClick={() => setDeleteApplication(app)}>
<Trash2 size={14} />
</button>
                </div>
</td>
</tr>
          ))}
</tbody>
</table>
 
      {selected && (
<div className="modal-overlay">
<div className="modal application-view-modal">
<button
  type="button"
  className="modal-close-icon"
  onClick={closeModal}
  aria-label="Close candidate details"
>
  <X size={18} />
</button>
<h3>Candidate Details</h3>
            <div className="application-view-card">
              <div className="application-view-row">
                <span>Candidate Name</span>
                <strong>{selected.name}</strong>
              </div>
              <div className="application-view-row">
                <span>Email</span>
                <strong>{selected.email}</strong>
              </div>
              <div className="application-view-row">
                <span>Position</span>
                <strong>{selected.jobTitle}</strong>
              </div>
              <div className="application-view-row">
                <span>Applied Date</span>
                <strong>{formatShortDate(selected.appliedDate)}</strong>
              </div>
              <div className="application-view-row">
                <span>Status</span>
                <span className={`status ${selected.status}`}>
                  {statusConfig[selected.status]?.label}
                </span>
              </div>
              <div className="application-view-actions">
                <button
                  type="button"
                  className="resume-btn"
                  onClick={() => openResumeInNewTab(selected.id)}
                  disabled={resumeLoading}
                >
                  {resumeLoading ? "Opening..." : "View Resume"}
                </button>
              </div>
              {resumeError && <p className="application-view-error">{resumeError}</p>}
</div>
            <div className="status-actions">
              <label className="status-dropdown-label">
                <span>Update Status</span>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="modal-actions application-modal-actions">
              {selected.status === "shortlisted" ? (
                <button
                  className="save-btn"
                  onClick={() =>
                    navigate("/admin/interviews", {
                      state: { candidate: selected },
                    })
                  }
                >
                  Schedule Interview
                </button>
              ) : (
                <span></span>
              )}
              <div className="application-modal-secondary-actions">
                <button type="button" className="close-btn application-update-btn" onClick={closeModal}>
                  UPDATE
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => setDeleteApplication(selected)}
                >
                  Delete
                </button>
              </div>
            </div>
</div>
</div>
      )}

      {deleteApplication && (
<div className="modal-overlay">
<div className="modal">
<h3>Delete Application</h3>
<p>Delete application from {deleteApplication.name}?</p>
            <div className="modal-actions">
<button type="button" className="close-btn" onClick={() => setDeleteApplication(null)}>
                Cancel
</button>
              <button type="button" className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
</div>
</div>
</div>
      )}
</div>
  );
};
export default Applications;
