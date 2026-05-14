import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FeedbackCard, {
  getDecisionValue,
  INTERVIEW_FEEDBACK_ADMIN_DECISION_API,
  INTERVIEW_FEEDBACK_API,
  INTERVIEW_FEEDBACK_BASE_API,
} from "./FeedbackCard.jsx";

const normalizeDecision = (value) => {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (normalizedValue === "on hold") {
    return "hold";
  }

  return normalizedValue;
};

const InterviewFeedback = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [feedbackList, setFeedbackList] = useState([]);
  const [adminDecisions, setAdminDecisions] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deleteFeedback, setDeleteFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin-login");
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(INTERVIEW_FEEDBACK_API, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load interview feedback.");
        }

        const feedbackItems = Array.isArray(data) ? data : data?.data || [];
        setFeedbackList(feedbackItems);
        setAdminDecisions(
          feedbackItems.reduce((accumulator, item) => {
            accumulator[item.id] = getDecisionValue(item) || "Selected";
            return accumulator;
          }, {})
        );
      } catch (fetchError) {
        console.error("Interview feedback fetch error:", fetchError);
        setError(fetchError.message || "Unable to load interview feedback.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [navigate]);

  const filteredFeedback = useMemo(() => {
    return feedbackList.filter((item) => {
      const candidateName = item.candidateName || item.candidate || "";
      const decision = getDecisionValue(item);

      const matchesSearch = candidateName
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        normalizeDecision(decision) === normalizeDecision(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [feedbackList, searchTerm, statusFilter]);

  const handleAdminDecisionChange = (feedbackId, value) => {
    setAdminDecisions((current) => ({
      ...current,
      [feedbackId]: value,
    }));
  };

  const saveAdminDecision = async (feedbackId) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    const nextDecision = adminDecisions[feedbackId];
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        decision: nextDecision,
        finalDecision: nextDecision,
        status: nextDecision,
        adminDecision: nextDecision,
      }),
    };

    setSavingId(feedbackId);
    setError("");

    try {
      const response = await fetch(
        `${INTERVIEW_FEEDBACK_ADMIN_DECISION_API}/${feedbackId}`,
        requestOptions
      );
      const raw = await response.text();

      let responseData = {};

      try {
        responseData = raw ? JSON.parse(raw) : {};
      } catch {
        responseData = raw;
      }

      if (!response?.ok) {
        throw new Error(
          responseData?.message ||
            "Unable to update admin decision."
        );
      }

      setFeedbackList((current) =>
        current.map((item) =>
          item.id === feedbackId
            ? {
                ...item,
                adminDecision: nextDecision,
                finalDecision: nextDecision,
                decision: nextDecision,
                status: nextDecision,
              }
            : item
        )
      );
      setAdminDecisions((current) => ({
        ...current,
        [feedbackId]: nextDecision,
      }));
    } catch (saveError) {
      console.error("Interview feedback update error:", saveError);
      setError(saveError.message || "Unable to update admin decision.");
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteFeedback = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      navigate("/admin-login");
      return;
    }

    if (!deleteFeedback) {
      return;
    }

    setError("");

    try {
      const response = await fetch(
        `${INTERVIEW_FEEDBACK_BASE_API}/${deleteFeedback.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const raw = await response.text();
      let responseData = {};

      try {
        responseData = raw ? JSON.parse(raw) : {};
      } catch {
        responseData = raw;
      }

      if (!response.ok) {
        throw new Error(responseData?.message || "Unable to delete feedback.");
      }

      setFeedbackList((current) =>
        current.filter((item) => item.id !== deleteFeedback.id)
      );
      setAdminDecisions((current) => {
        const next = { ...current };
        delete next[deleteFeedback.id];
        return next;
      });
      setDeleteFeedback(null);
    } catch (deleteError) {
      console.error("Interview feedback delete error:", deleteError);
      setError(deleteError.message || "Unable to delete feedback.");
    }
  };

  return (
    <div className="interview-feedback-page">
      <div className="interview-feedback-header">
        <div>
          <h1>Interview Feedback</h1>
        </div>
      </div>

      <div className="interview-feedback-toolbar">
        <div className="interview-feedback-search">
          <Search size={16} aria-hidden="true" />
          <input
            type="text"
            placeholder="Search by candidate name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="interview-feedback-filter"
        >
          <option value="All">All</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {isLoading ? (
        <div className="interview-feedback-empty">Loading feedback...</div>
      ) : error ? (
        <>
          <div className="interview-feedback-status-error">{error}</div>
          {filteredFeedback.length === 0 ? (
            <div className="interview-feedback-empty">
              No feedback found for the current search or filter.
            </div>
          ) : (
            <div className="interview-feedback-grid">
              {filteredFeedback.map((feedback) => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  adminDecision={adminDecisions[feedback.id] || "Selected"}
                  onAdminDecisionChange={handleAdminDecisionChange}
                  onSaveDecision={saveAdminDecision}
                  isSavingDecision={savingId === feedback.id}
                  onDelete={setDeleteFeedback}
                />
              ))}
            </div>
          )}
        </>
      ) : filteredFeedback.length === 0 ? (
        <div className="interview-feedback-empty">
          No feedback found for the current search or filter.
        </div>
      ) : (
        <div className="interview-feedback-grid">
          {filteredFeedback.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              adminDecision={adminDecisions[feedback.id] || "Selected"}
              onAdminDecisionChange={handleAdminDecisionChange}
              onSaveDecision={saveAdminDecision}
              isSavingDecision={savingId === feedback.id}
              onDelete={setDeleteFeedback}
            />
          ))}
        </div>
      )}

      {deleteFeedback ? (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Feedback</h3>
            <p>
              Delete feedback for{" "}
              {deleteFeedback.candidateName ||
                deleteFeedback.candidate ||
                "this candidate"}
              ?
            </p>
            <div className="modal-actions">
              <button type="button" onClick={() => setDeleteFeedback(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={handleDeleteFeedback}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default InterviewFeedback;
