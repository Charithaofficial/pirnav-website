import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";

const API_BASE = buildApiUrl("Jobs");
const experienceOptions = [
  "Fresher",
  "0-1 years",
  "1-2 years",
  "2-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "10+ years",
];

const ctcOptions = [
  "Negotiable",
  "1-2 LPA",
  "2-3 LPA",
  "3-5 LPA",
  "5-7 LPA",
  "7-10 LPA",
  "10-15 LPA",
  "15+ LPA",
];

const qualificationOptions = [
  "Any Graduate",
  "B.Tech / B.E",
  "M.Tech / M.E",
  "BCA",
  "MCA",
  "B.Sc",
  "M.Sc",
  "MBA",
  "Diploma",
  "PhD",
];

const initialJobForm = {
  jobTitle: "",
  workLocation: "",
  jobType: "full-time",
  status: "open",
  experience: "",
  ctc: "",
  highestQualification: "",
  jobDescription: "",
  keyResponsibilities: "",
  mandatorySkills: "",
};

const initialJobErrors = {
  jobTitle: "",
  workLocation: "",
  jobType: "",
  status: "",
  experience: "",
  ctc: "",
  highestQualification: "",
  jobDescription: "",
  keyResponsibilities: "",
  mandatorySkills: "",
};

const textFieldWordLimits = {
  jobDescription: 500,
  keyResponsibilities: 300,
  mandatorySkills: 150,
};

const hasLetters = (value = "") => /[A-Za-z]/.test(value);
const hasDropdownValue = (value = "") => value.trim().length > 0;
const getWordCount = (value = "") => {
  const words = value.trim().match(/\S+/g);
  return words ? words.length : 0;
};

const getSelectOptions = (options, currentValue) => {
  const trimmedValue = currentValue.trim();
  if (!trimmedValue || options.includes(trimmedValue)) {
    return options;
  }
  return [trimmedValue, ...options];
};

const validateJobField = (name, value) => {
  const trimmed = value.trim();

  switch (name) {
    case "jobTitle":
      if (!trimmed || trimmed.length < 3 || trimmed.length > 100 || !hasLetters(trimmed)) {
        return "Enter a valid job title";
      }
      return "";
    case "workLocation":
      if (!trimmed || trimmed.length < 2 || trimmed.length > 80 || !hasLetters(trimmed)) {
        return "Enter a valid work location";
      }
      return "";
    case "jobType":
      if (!["full-time", "part-time", "hybrid", "remote"].includes(trimmed)) {
        return "Select a valid job type";
      }
      return "";
    case "status":
      if (!["open", "closed"].includes(trimmed)) {
        return "Select a valid status";
      }
      return "";
    case "experience":
      if (!hasDropdownValue(trimmed)) {
        return "Enter a valid experience";
      }
      return "";
    case "ctc":
      if (!hasDropdownValue(trimmed)) {
        return "Enter a valid CTC";
      }
      return "";
    case "highestQualification":
      if (!hasDropdownValue(trimmed)) {
        return "Enter a valid qualification";
      }
      return "";
    case "jobDescription":
      if (!trimmed || trimmed.length < 30 || !hasLetters(trimmed)) {
        return "Enter a valid job description";
      }
      if (trimmed.length > 3000 || getWordCount(trimmed) > textFieldWordLimits.jobDescription) {
        return `Job description must be ${textFieldWordLimits.jobDescription} words or less`;
      }
      return "";
    case "keyResponsibilities":
      if (!trimmed || trimmed.length < 20 || !hasLetters(trimmed)) {
        return "Enter valid key responsibilities";
      }
      if (trimmed.length > 3000 || getWordCount(trimmed) > textFieldWordLimits.keyResponsibilities) {
        return `Key responsibilities must be ${textFieldWordLimits.keyResponsibilities} words or less`;
      }
      return "";
    case "mandatorySkills":
      if (!trimmed || trimmed.length < 10 || !hasLetters(trimmed)) {
        return "Enter valid mandatory skills";
      }
      if (trimmed.length > 1500 || getWordCount(trimmed) > textFieldWordLimits.mandatorySkills) {
        return `Mandatory skills must be ${textFieldWordLimits.mandatorySkills} words or less`;
      }
      return "";
    default:
      return "";
  }
};

const validateJobForm = (values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, validateJobField(key, value)])
  );

const hasJobFormErrors = (errors) => Object.values(errors).some(Boolean);

const buildJobPayload = (values) => {
  const payload = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim()])
  );

  return {
    ...payload,
    responsibilities: payload.keyResponsibilities,
  };
};

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState(null);

  const [form, setForm] = useState(initialJobForm);
  const [formErrors, setFormErrors] = useState(initialJobErrors);
  const [formTouched, setFormTouched] = useState({});

  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return null;
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "true",
    };
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      if (!headers) return;
      const res = await fetch(API_BASE, { headers });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const nextErrors = validateJobForm(form);
      setFormErrors(nextErrors);
      setFormTouched(
        Object.fromEntries(Object.keys(initialJobForm).map((key) => [key, true]))
      );

      if (hasJobFormErrors(nextErrors)) {
        return;
      }

      const headers = getHeaders();
      if (!headers) return;
      const method = editingJob ? "PUT" : "POST";
      const url = editingJob ? `${API_BASE}/${editingJob.id}` : API_BASE;
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(buildJobPayload(form)),
      });
      if (!res.ok) {
        alert("Operation failed");
        return;
      }
      setShowModal(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const headers = getHeaders();
      if (!headers) return;
      const res = await fetch(`${API_BASE}/${editingJob.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        alert("Delete failed");
        return;
      }
      setDeleteModal(false);
      setEditingJob(null);
      fetchJobs();
    } catch (error) {
      console.error(error);
    }
  };

  const openCreate = () => {
    setEditingJob(null);
    setForm(initialJobForm);
    setFormErrors(initialJobErrors);
    setFormTouched({});
    setShowModal(true);
  };

  const openEdit = (job) => {
    setEditingJob(job);
    setForm({
      jobTitle: job.jobTitle || "",
      workLocation: job.workLocation || "",
      jobType: job.jobType || "full-time",
      status: job.status || "open",
      experience: job.experience || "",
      ctc: job.ctc || "",
      highestQualification: job.highestQualification || "",
      jobDescription: job.jobDescription || "",
      keyResponsibilities: job.keyResponsibilities || job.responsibilities || "",
      mandatorySkills: job.mandatorySkills || "",
    });
    setFormErrors(initialJobErrors);
    setFormTouched({});
    setShowModal(true);
  };

  const updateField = (field, value) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    setFormErrors((current) => ({
      ...current,
      [field]: validateJobField(field, value),
    }));
  };

  const handleFieldBlur = (field) => {
    setFormTouched((current) => ({ ...current, [field]: true }));
    setFormErrors((current) => ({
      ...current,
      [field]: validateJobField(field, form[field]),
    }));
  };

  const getFieldError = (field) => (formTouched[field] ? formErrors[field] : "");

  const filteredJobs = jobs.filter((job) =>
    job.jobTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="jobs-wrapper">
      <div className="jobs-header">
        <h1>Jobs</h1>
        <div className="jobs-header-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              placeholder="Search jobs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="add-btn job-post-btn" onClick={openCreate}>
            <Plus size={16} /> Post New Job
          </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      <div className="jobs-accordion">
        {filteredJobs.map((job) => (
          <div key={job.id} className="job-card-admin">
            <div className="job-header-admin">
              <div>
                <h3>{job.jobTitle}</h3>
                <p>
                  {job.workLocation} | {job.jobType} | Experience:{" "}
                  {job.experience}
                </p>
              </div>

              <div className="job-actions-admin">
                <button
                  className="expand-btn"
                  onClick={() => setOpenId(openId === job.id ? null : job.id)}
                >
                  {openId === job.id ? "-" : "+"}
                </button>

                <button onClick={() => openEdit(job)}>
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => {
                    setEditingJob(job);
                    setDeleteModal(true);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div
              className={`job-expand-section ${openId === job.id ? "active" : ""}`}
            >
              <div className="expand-content">
                <p><strong>CTC:</strong> {job.ctc}</p>
                <p><strong>Status:</strong> {job.status}</p>
                <p><strong>Highest Qualification:</strong> {job.highestQualification}</p>
                <h4>Job Description</h4>
                <p>{job.jobDescription}</p>
                <h4>Key Responsibilities</h4>
                <pre>{job.keyResponsibilities || job.responsibilities}</pre>
                <h4>Mandatory Skills</h4>
                <pre>{job.mandatorySkills}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal large job-modal">
            <h3>{editingJob ? "Edit Job" : "Post New Job"}</h3>
            <div className="admin-form-field">
            <label htmlFor="admin-job-title">Job Title</label>
            <input
              id="admin-job-title"
              placeholder="Job Title"
              value={form.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              onBlur={() => handleFieldBlur("jobTitle")}
              aria-invalid={Boolean(getFieldError("jobTitle"))}
            />
            {getFieldError("jobTitle") ? <small className="admin-inline-error">{getFieldError("jobTitle")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-location">Work Location</label>
            <input
              id="admin-job-location"
              placeholder="Work Location"
              value={form.workLocation}
              onChange={(e) => updateField("workLocation", e.target.value)}
              onBlur={() => handleFieldBlur("workLocation")}
              aria-invalid={Boolean(getFieldError("workLocation"))}
            />
            {getFieldError("workLocation") ? <small className="admin-inline-error">{getFieldError("workLocation")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-type">Job Type</label>
            <select
              id="admin-job-type"
              value={form.jobType}
              onChange={(e) => updateField("jobType", e.target.value)}
              onBlur={() => handleFieldBlur("jobType")}
              aria-invalid={Boolean(getFieldError("jobType"))}
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
            {getFieldError("jobType") ? <small className="admin-inline-error">{getFieldError("jobType")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-status">Status</label>
            <select
              id="admin-job-status"
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
              onBlur={() => handleFieldBlur("status")}
              aria-invalid={Boolean(getFieldError("status"))}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            {getFieldError("status") ? <small className="admin-inline-error">{getFieldError("status")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-experience">Experience</label>
            <select
              id="admin-job-experience"
              value={form.experience}
              onChange={(e) => updateField("experience", e.target.value)}
              onBlur={() => handleFieldBlur("experience")}
              aria-invalid={Boolean(getFieldError("experience"))}
            >
              <option value="" disabled>Select Experience</option>
              {getSelectOptions(experienceOptions, form.experience).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {getFieldError("experience") ? <small className="admin-inline-error">{getFieldError("experience")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-ctc">CTC</label>
            <select
              id="admin-job-ctc"
              value={form.ctc}
              onChange={(e) => updateField("ctc", e.target.value)}
              onBlur={() => handleFieldBlur("ctc")}
              aria-invalid={Boolean(getFieldError("ctc"))}
            >
              <option value="" disabled>Select CTC</option>
              {getSelectOptions(ctcOptions, form.ctc).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {getFieldError("ctc") ? <small className="admin-inline-error">{getFieldError("ctc")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-qualification">Highest Qualification</label>
            <select
              id="admin-job-qualification"
              value={form.highestQualification}
              onChange={(e) =>
                updateField("highestQualification", e.target.value)
              }
              onBlur={() => handleFieldBlur("highestQualification")}
              aria-invalid={Boolean(getFieldError("highestQualification"))}
            >
              <option value="" disabled>Select Highest Qualification</option>
              {getSelectOptions(qualificationOptions, form.highestQualification).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {getFieldError("highestQualification") ? <small className="admin-inline-error">{getFieldError("highestQualification")}</small> : null}
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-description">Job Description</label>
            <textarea
              id="admin-job-description"
              placeholder="Job Description"
              value={form.jobDescription}
              onChange={(e) => updateField("jobDescription", e.target.value)}
              onBlur={() => handleFieldBlur("jobDescription")}
              aria-invalid={Boolean(getFieldError("jobDescription"))}
            />
            {getFieldError("jobDescription") ? <small className="admin-inline-error">{getFieldError("jobDescription")}</small> : null}
            <small className={`admin-word-count ${getWordCount(form.jobDescription) > textFieldWordLimits.jobDescription ? "over-limit" : ""}`}>
              {getWordCount(form.jobDescription)} / {textFieldWordLimits.jobDescription} words
            </small>
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-responsibilities">Key Responsibilities</label>
            <textarea
              id="admin-job-responsibilities"
              placeholder="Add each responsibility on a new line"
              value={form.keyResponsibilities}
              onChange={(e) => updateField("keyResponsibilities", e.target.value)}
              onBlur={() => handleFieldBlur("keyResponsibilities")}
              aria-invalid={Boolean(getFieldError("keyResponsibilities"))}
            />
            {getFieldError("keyResponsibilities") ? <small className="admin-inline-error">{getFieldError("keyResponsibilities")}</small> : null}
            <small className={`admin-word-count ${getWordCount(form.keyResponsibilities) > textFieldWordLimits.keyResponsibilities ? "over-limit" : ""}`}>
              {getWordCount(form.keyResponsibilities)} / {textFieldWordLimits.keyResponsibilities} words
            </small>
            </div>
            <div className="admin-form-field">
            <label htmlFor="admin-job-skills">Mandatory Skills</label>
            <textarea
              id="admin-job-skills"
              placeholder="Mandatory Skills"
              value={form.mandatorySkills}
              onChange={(e) =>
                updateField("mandatorySkills", e.target.value)
              }
              onBlur={() => handleFieldBlur("mandatorySkills")}
              aria-invalid={Boolean(getFieldError("mandatorySkills"))}
            />
            {getFieldError("mandatorySkills") ? <small className="admin-inline-error">{getFieldError("mandatorySkills")}</small> : null}
            <small className={`admin-word-count ${getWordCount(form.mandatorySkills) > textFieldWordLimits.mandatorySkills ? "over-limit" : ""}`}>
              {getWordCount(form.mandatorySkills)} / {textFieldWordLimits.mandatorySkills} words
            </small>
            </div>
            <div className="modal-actions">
              <button className="job-modal-cancel-btn" onClick={() => {
                setShowModal(false);
                setFormErrors(initialJobErrors);
                setFormTouched({});
              }}>Cancel</button>
              <button onClick={handleSave} className="save-btn job-modal-action-btn">
                {editingJob ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Job</h3>
            <p>Are you sure you want to delete this job?</p>
            <div className="modal-actions">
              <button className="job-modal-cancel-btn" onClick={() => setDeleteModal(false)}>Cancel</button>
              <button onClick={handleDelete} className="delete-btn job-modal-action-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
