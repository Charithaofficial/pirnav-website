import { Trash2 } from "lucide-react";
import { buildApiUrl } from "../../config/api";

export const INTERVIEW_FEEDBACK_API = buildApiUrl("InterviewFeedback/all");
export const INTERVIEW_FEEDBACK_BASE_API = buildApiUrl("InterviewFeedback");
export const INTERVIEW_FEEDBACK_ADMIN_DECISION_API = buildApiUrl("InterviewFeedback/admin-decision");

export const getDecisionValue = (feedback) =>
  feedback.adminDecision ||
  feedback.recommendation ||
  feedback.recommendedDecision ||
  feedback.interviewerDecision ||
  feedback.interviewerRecommendation ||
  feedback.managerDecision ||
  feedback.managerRecommendation ||
  feedback.result ||
  feedback.finalResult ||
  feedback.finalDecision ||
  feedback.decision ||
  feedback.status ||
  "Pending";

const getDisplayValue = (...values) =>
  values.find(
    (value) =>
      value !== undefined && value !== null && String(value).trim() !== ""
  );

const getDecisionClassName = (decision) => {
  const normalizedDecision = decision.toLowerCase();

  if (normalizedDecision === "selected") {
    return "selected";
  }

  if (normalizedDecision === "rejected") {
    return "rejected";
  }

  if (normalizedDecision === "on hold" || normalizedDecision === "hold") {
    return "hold";
  }

  if (normalizedDecision === "pending") {
    return "";
  }

  return "";
};

const FeedbackCard = ({
  feedback,
  adminDecision,
  onAdminDecisionChange,
  onSaveDecision,
  isSavingDecision,
  onDelete,
}) => {
  const rating = Number(
    getDisplayValue(
      feedback.rating,
      feedback.overallRating,
      feedback.totalRating,
      feedback.score
    ) || 0
  );
  const decision = getDecisionValue(feedback);
  const decisionClassName = getDecisionClassName(decision);
  const candidateName =
    getDisplayValue(
      feedback.candidateName,
      feedback.candidate,
      feedback.candidateFullName,
      feedback.name,
      feedback.applicantName
    ) || "N/A";
  const role =
    getDisplayValue(
      feedback.jobTitle,
      feedback.role,
      feedback.position,
      feedback.jobRole
    ) || "N/A";
  const managerName =
    getDisplayValue(
      feedback.managerName,
      feedback.interviewerName,
      feedback.interviewer,
      feedback.employeeName,
      feedback.reviewerName
    ) || "N/A";
  const comments =
    getDisplayValue(
      feedback.comments,
      feedback.feedback,
      feedback.comment,
      feedback.notes,
      feedback.remark
    ) || "No comments available.";

  return (
    <article className="feedback-card">
      <div className="feedback-list-main">
        <div className="feedback-card-identity">
          <div>
            <p className="feedback-label">Candidate</p>
            <h3>{candidateName}</h3>
            <p className="feedback-role">{role}</p>
            <p className="feedback-manager">Manager: {managerName}</p>
          </div>
        </div>

        <div className="feedback-comments">
          <strong>Comments</strong>
          <p>{comments}</p>
        </div>
      </div>

      <div className="feedback-list-side">
        <div className="feedback-card-meta">
          <span className={`feedback-badge ${decisionClassName}`}>{decision}</span>

          <div className="feedback-rating-panel">
            <span className="feedback-section-title">Rating</span>
            <div className="feedback-rating" aria-label={`Rating ${rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? "feedback-star-filled" : "feedback-star-empty"}
                >
                  {"\u2605"}
                </span>
              ))}
            </div>
            <span className="feedback-rating-value">{rating}/5</span>
          </div>
        </div>

        <div className="feedback-admin-actions">
          <label className="feedback-admin-label">
            <span>Admin Decision</span>
            <select
              value={adminDecision}
              onChange={(event) => onAdminDecisionChange(feedback.id, event.target.value)}
              disabled={isSavingDecision}
            >
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="On Hold">On Hold</option>
            </select>
          </label>

          <div className="feedback-admin-buttons">
            <button
              type="button"
              className="feedback-save-btn"
              onClick={() => onSaveDecision(feedback.id)}
              disabled={isSavingDecision || adminDecision === decision}
            >
              {isSavingDecision ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="delete-btn feedback-delete-btn"
              onClick={() => onDelete(feedback)}
              disabled={isSavingDecision}
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default FeedbackCard;
