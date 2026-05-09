import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarClock, Trash2 } from "lucide-react";
import { buildApiUrl } from "../../config/api";

const INTERVIEW_API = buildApiUrl("Interview");
const APPLICATIONS_API = buildApiUrl("JobApplications");
const MANAGER_API = buildApiUrl("Managers");

const initialForm = {
  candidateId: "",
  interviewDate: "",
  interviewTime: "",
  managerId: "",
  mode: "Online",
  meetingLink: "",
  notes: "",
};

const getInterviewSortTime = (interview) => {
  const dateValue =
    interview.updatedAt ||
    interview.modifiedAt ||
    interview.createdAt ||
    interview.scheduledAt ||
    interview.interviewDate;
  const timestamp = dateValue ? new Date(dateValue).getTime() : 0;

  if (!Number.isNaN(timestamp) && timestamp > 0) {
    return timestamp;
  }

  return Number(interview.id) || 0;
};

const sortLatestInterviews = (items = []) =>
  [...items].sort((first, second) => getInterviewSortTime(second) - getInterviewSortTime(first));

const Interviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [managers, setManagers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [deleteInterview, setDeleteInterview] = useState(null);
  const [editingInterview, setEditingInterview] = useState(null);
  const [notice, setNotice] = useState(null);

  const selectedCandidate = shortlistedCandidates.find(
    (candidate) => String(candidate.id) === String(form.candidateId)
  );

  const selectedManager = managers.find(
    (manager) => String(manager.id) === String(form.managerId)
  );

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

  const fetchInterviews = async () => {
    try {
      const res = await fetch(INTERVIEW_API, { headers: getHeaders() });
      const data = await res.json();
      setInterviews(sortLatestInterviews(Array.isArray(data) ? data : data.data || []));
    } catch (err) {
      console.error("Interview fetch error:", err);
    }
  };

  const fetchCandidates = async () => {
    try {
      const res = await fetch(APPLICATIONS_API, { headers: getHeaders() });
      const data = await res.json();
      const filtered = (Array.isArray(data) ? data : data.data || []).filter(
        (item) => item.status?.toLowerCase() === "shortlisted"
      );
      setShortlistedCandidates(filtered);
    } catch (err) {
      console.error("Candidate fetch error:", err);
    }
  };

  const fetchManagers = async () => {
    try {
      const res = await fetch(MANAGER_API, { headers: getHeaders() });
      if (!res.ok) throw new Error("Manager fetch failed");

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data || data.managers || [];
      const mapped = list.map((manager) => ({
        id: manager.id,
        name: manager.name,
        email: manager.email,
      }));
      setManagers(mapped);
    } catch (err) {
      console.error("Manager fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInterviews();
    fetchCandidates();
    fetchManagers();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setNotice(null);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingInterview(null);
  };

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatTime = (value) => {
    if (!value) return "";

    const trimmed = String(value).slice(0, 5);
    const [hourText = "", minuteText = ""] = trimmed.split(":");
    const hour = Number(hourText);
    const minute = Number(minuteText);

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return trimmed;
    }

    return new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(2000, 0, 1, hour, minute));
  };

  const formatSchedule = (interview) => {
    const dateText = formatDate(interview.scheduledAt || interview.interviewDate);
    const timeText = formatTime(interview.interviewTime);

    if (dateText && timeText) {
      return `${dateText}, ${timeText}`;
    }

    return dateText || timeText;
  };

  const handleRescheduleClick = (interview) => {
    setEditingInterview(interview);
    setForm({
      candidateId: String(interview.applicationId ?? interview.candidateId ?? ""),
      interviewDate:
        interview.interviewDate ||
        (interview.scheduledAt ? String(interview.scheduledAt).slice(0, 10) : ""),
      interviewTime: String(interview.interviewTime || "").slice(0, 5),
      managerId: String(interview.managerId ?? ""),
      mode: interview.mode || "Online",
      meetingLink: interview.meetingLink || "",
      notes: interview.notes || "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.candidateId) {
      setNotice({ type: "error", message: "Please select candidate." });
      return;
    }

    if (!form.managerId) {
      setNotice({ type: "error", message: "Please select manager." });
      return;
    }

    if (!form.interviewDate || !form.interviewTime) {
      setNotice({ type: "error", message: "Please select date and time." });
      return;
    }

    if (form.mode === "Online" && !form.meetingLink) {
      setNotice({ type: "error", message: "Meeting link required for online interview." });
      return;
    }

    const payload = editingInterview
      ? {
          interviewDate: form.interviewDate,
          interviewTime: `${form.interviewTime}:00`,
          mode: form.mode.toLowerCase(),
          meetingLink: form.meetingLink || "",
          notes: form.notes || "",
          managerId: Number(form.managerId),
          status: "rescheduled",
        }
      : {
          applicationId: Number(form.candidateId),
          interviewDate: form.interviewDate,
          interviewTime: `${form.interviewTime}:00`,
          managerId: Number(form.managerId),
          mode: form.mode,
          meetingLink: form.meetingLink || "",
          notes: form.notes || "",
        };

    try {
      setSaving(true);
      const res = await fetch(
        editingInterview ? `${INTERVIEW_API}/${editingInterview.id}` : INTERVIEW_API,
        {
          method: editingInterview ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        }
      );
      const result = await res.text();
      if (!res.ok) throw new Error(result);
      setNotice({
        type: "success",
        message: editingInterview
          ? "Interview rescheduled successfully."
          : "Interview scheduled successfully.",
      });
      resetForm();
      await fetchInterviews();
    } catch (err) {
      console.error("Submit error:", err);
      setNotice({ type: "error", message: `Error: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!deleteInterview) {
      return;
    }

    try {
      const res = await fetch(`${INTERVIEW_API}/${deleteInterview.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Delete failed");
      }

      setInterviews((current) =>
        sortLatestInterviews(current.filter((interview) => interview.id !== deleteInterview.id))
      );
      setDeleteInterview(null);
    } catch (err) {
      console.error("Interview delete error:", err);
      setNotice({ type: "error", message: `Error: ${err.message}` });
    }
  };

  return (
    <div
      style={{
        padding: "28px",
        background: "linear-gradient(180deg, #f7fbff 0%, #eef5fb 100%)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "7px 12px",
              borderRadius: "999px",
              background: "#dbeafe",
              color: "#1d4ed8",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            Interview Workflow
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(360px, 420px) minmax(0, 1fr)",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #d9e4f0",
              borderRadius: "24px",
              padding: "24px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div style={{ marginBottom: "18px" }}>
              <h3 style={{ margin: "0 0 8px", color: "#12314a", fontSize: "22px" }}>
                Schedule Interview
              </h3>
              <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                {editingInterview
                  ? "Update the interview date, time, or manager and save the new schedule."
                  : "Pick a candidate, assign a manager, and schedule the interview without changing any existing workflow."}
              </p>
            </div>

            {notice ? (
              <div
                role="status"
                aria-live="polite"
                className={`interview-notice-bar ${notice.type}`}
              >
                {notice.message}
              </div>
            ) : null}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
                marginBottom: "18px",
              }}
            >
              <div style={{ padding: "14px", borderRadius: "18px", background: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <div style={{ fontSize: "12px", color: "#1d4ed8", fontWeight: 700 }}>
                  Shortlisted
                </div>
                <strong style={{ display: "block", marginTop: "6px", fontSize: "24px", color: "#0f172a" }}>
                  {shortlistedCandidates.length}
                </strong>
              </div>
              <div style={{ padding: "14px", borderRadius: "18px", background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                <div style={{ fontSize: "12px", color: "#15803d", fontWeight: 700 }}>
                  Managers
                </div>
                <strong style={{ display: "block", marginTop: "6px", fontSize: "24px", color: "#0f172a" }}>
                  {managers.length}
                </strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                Candidate
                <select value={form.candidateId} onChange={(event) => handleChange("candidateId", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px", background: "#fff" }}>
                  <option value="">Select Candidate</option>
                  {shortlistedCandidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name} - {candidate.jobTitle}
                    </option>
                  ))}
                </select>
              </label>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "12px" }}>
                <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                  Date
                  <input type="date" value={form.interviewDate} onChange={(event) => handleChange("interviewDate", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px" }} />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                  Time
                  <input type="time" value={form.interviewTime} onChange={(event) => handleChange("interviewTime", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px" }} />
                </label>
              </div>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                Interview Manager
                <select value={form.managerId} onChange={(event) => handleChange("managerId", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px", background: "#fff" }}>
                  <option value="">Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name} ({manager.email})
                    </option>
                  ))}
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                Mode
                <select value={form.mode} onChange={(event) => handleChange("mode", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px", background: "#fff" }}>
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Phone">Phone</option>
                </select>
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                Meeting Link / Location
                <input type="text" placeholder="Meeting Link or Location" value={form.meetingLink} onChange={(event) => handleChange("meetingLink", event.target.value)} style={{ minHeight: "48px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px" }} />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", color: "#334155", fontWeight: 600 }}>
                Notes
                <textarea placeholder="Notes" value={form.notes} onChange={(event) => handleChange("notes", event.target.value)} style={{ minHeight: "110px", borderRadius: "14px", border: "1px solid #d7e0ea", padding: "12px 14px", resize: "vertical", fontFamily: "sans-serif" }} />
              </label>

              {(selectedCandidate || selectedManager) && (
                <div style={{ display: "grid", gap: "10px", padding: "14px", borderRadius: "18px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                  {selectedCandidate ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                        Selected Candidate
                      </div>
                      <div style={{ marginTop: "4px", color: "#0f172a", fontWeight: 700 }}>
                        {selectedCandidate.name}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        {selectedCandidate.jobTitle}
                      </div>
                    </div>
                  ) : null}
                  {selectedManager ? (
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                        Assigned Manager
                      </div>
                      <div style={{ marginTop: "4px", color: "#0f172a", fontWeight: 700 }}>
                        {selectedManager.name}
                      </div>
                      <div style={{ color: "#64748b", fontSize: "14px" }}>
                        {selectedManager.email}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button type="submit" disabled={saving} className="interview-schedule-submit-btn">
                  {saving ? "Saving..." : editingInterview ? "Save Reschedule" : "Schedule Interview"}
                </button>
                {editingInterview ? (
                  <button type="button" onClick={resetForm} style={{ flex: "0 1 140px", minHeight: "48px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "#fff", color: "#334155", fontWeight: 700, cursor: "pointer" }}>
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div style={{ background: "#ffffff", border: "1px solid #d9e4f0", borderRadius: "24px", padding: "24px", boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", alignItems: "flex-end", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: "0 0 8px", color: "#12314a", fontSize: "22px" }}>
                  Interview List
                </h3>
                <p style={{ margin: 0, color: "#64748b", lineHeight: 1.6 }}>
                  Browse all scheduled interviews and monitor the current interview pipeline.
                </p>
              </div>
              <div style={{ padding: "10px 14px", borderRadius: "16px", background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1d4ed8", fontWeight: 700, whiteSpace: "nowrap" }}>
                Total: {interviews.length}
              </div>
            </div>

            {interviews.length === 0 ? (
              <div style={{ padding: "26px", borderRadius: "18px", background: "#f8fafc", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b" }}>
                No interviews found
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {interviews.map((interview) => (
                  <div key={interview.id} style={{ border: "1px solid #dbe4ee", padding: "18px", borderRadius: "18px", background: "linear-gradient(180deg, #ffffff, #f8fbff)", boxShadow: "0 12px 24px rgba(15, 23, 42, 0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        <div style={{ fontSize: "18px", fontWeight: 700, color: "#0f172a" }}>
                          {interview.candidateName}
                        </div>
                        <div style={{ color: "#475569" }}>{interview.email}</div>
                        <div style={{ color: "#475569" }}>{interview.jobTitle}</div>
                      </div>

                      <div style={{ display: "grid", gap: "8px", minWidth: "220px", justifyItems: "end" }}>
                        <span style={{ padding: "7px 12px", borderRadius: "999px", background: "#dbeafe", color: "#1d4ed8", fontSize: "12px", fontWeight: 700, textTransform: "capitalize" }}>
                          {interview.status}
                        </span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                          <button type="button" onClick={() => handleRescheduleClick(interview)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "40px", padding: "0 14px", borderRadius: "999px", border: "1px solid #fcd34d", background: "#fffbeb", color: "#b45309", fontWeight: 700, cursor: "pointer" }}>
                            <CalendarClock size={14} />
                            Reschedule
                          </button>
                          <button type="button" onClick={() => setDeleteInterview(interview)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "40px", padding: "0 14px", borderRadius: "999px", border: "1px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                        <div style={{ color: "#334155", fontWeight: 600 }}>{interview.mode}</div>
                        {formatSchedule(interview) ? (
                          <div style={{ color: "#64748b", fontSize: "14px" }}>
                            {formatSchedule(interview)}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {(interview.interviewer || interview.notes || interview.meetingLink) && (
                      <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid #e2e8f0", display: "grid", gap: "8px", color: "#475569" }}>
                        {interview.interviewer ? <div><strong style={{ color: "#0f172a" }}>Manager:</strong> {interview.interviewer}</div> : null}
                        {interview.meetingLink ? <div><strong style={{ color: "#0f172a" }}>Link:</strong> {interview.meetingLink}</div> : null}
                        {interview.notes ? <div><strong style={{ color: "#0f172a" }}>Notes:</strong> {interview.notes}</div> : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {deleteInterview && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Interview</h3>
            <p>Delete interview scheduled for {deleteInterview.candidateName}?</p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteInterview(null)}>
                Cancel
              </button>
              <button type="button" className="delete-btn" onClick={handleDeleteInterview}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interviews;
