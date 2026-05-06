import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./Careers.css";
import { buildApiUrl } from "../../config/api";

const JOB_APPLICATIONS_API = buildApiUrl("JobApplications");

const detailItems = [
  { key: "workLocation", label: "Location", fallback: "Flexible" },
  { key: "jobType", label: "Type", fallback: "Full-time" },
  { key: "experience", label: "Experience", fallback: "Based on role fit" },
  { key: "ctc", label: "CTC", fallback: "Shared during process" },
  { key: "highestQualification", label: "Qualification", fallback: "Relevant qualification" },
];

const splitSkills = (skills) => {
  if (!skills) {
    return [];
  }

  return skills
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const textOnlyRegex = /^[A-Za-z]+(?:[A-Za-z\s.'-]*[A-Za-z])?$/;
const ctcRegex = /^[0-9A-Za-z.,\s/-]+$/;

const formSections = [
  {
    title: "Personal",
    description: "Basic information so we can identify and contact you.",
    fields: [
      { id: "fullName", label: "Full Name *", type: "text", name: "fullName", required: true },
      { id: "email", label: "Email *", type: "email", name: "email", required: true },
      { id: "phone", label: "Phone *", type: "tel", name: "phone", required: true, inputMode: "numeric", maxLength: 10 },
      {
        id: "gender",
        label: "Gender *",
        type: "select",
        name: "gender",
        required: true,
        options: ["Male", "Female", "Other"],
      },
      { id: "location", label: "Location *", type: "text", name: "location", required: true },
    ],
  },
  {
    title: "Professional",
    description: "Help us understand your background and current role.",
    fields: [
      { id: "experience", label: "Experience", type: "number", name: "experience", required: false, min: 0, max: 50, step: "0.1" },
      { id: "noticePeriod", label: "Notice Period", type: "text", name: "noticePeriod", required: false },
      { id: "currentCTC", label: "Current CTC", type: "text", name: "currentCTC", required: false },
      { id: "expectedCTC", label: "Expected CTC", type: "text", name: "expectedCTC", required: false },
    ],
  },
  {
    title: "Links & Resume",
    description: "Share any project or social links if you want to showcase your work, and upload your latest resume.",
    fields: [
      { id: "linkedin", label: "LinkedIn", type: "url", name: "linkedin", required: false, full: true },
      { id: "portfolio", label: "Portfolio / Website", type: "url", name: "portfolio", required: false, full: true },
      { id: "github", label: "GitHub / Project Link", type: "url", name: "github", required: false, full: true },
      { id: "socialLinks", label: "Other Social Media Links", type: "text", name: "socialLinks", required: false, full: true },
      { id: "resume", label: "Upload Resume *", type: "file", name: "resume", required: true, full: true },
    ],
  },
];

const JobDetails = () => {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    experience: "",
    currentCTC: "",
    expectedCTC: "",
    noticePeriod: "",
    location: "",
    linkedin: "",
    portfolio: "",
    github: "",
    socialLinks: "",
    resume: null,
  });

  const validateUrl = (value, label) => {
    if (!value.trim()) {
      return "";
    }

    try {
      const normalizedValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      new URL(normalizedValue);
      return "";
    } catch {
      return `Please enter a valid ${label.toLowerCase()} URL.`;
    }
  };

  const validateField = (name, value) => {
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    switch (name) {
      case "fullName":
        if (!trimmedValue) return "Full name is required.";
        if (trimmedValue.length < 3) return "Full name must be at least 3 characters.";
        if (!textOnlyRegex.test(trimmedValue)) return "Enter a valid full name.";
        return "";
      case "email":
        if (!trimmedValue) return "Email is required.";
        if (!emailRegex.test(trimmedValue)) return "Enter a valid email address.";
        return "";
      case "phone":
        if (!trimmedValue) return "Phone number is required.";
        if (!phoneRegex.test(String(trimmedValue).replace(/\D/g, ""))) {
          return "Phone number must be 10 digits.";
        }
        return "";
      case "gender":
        if (!trimmedValue) return "Please select your gender.";
        return "";
      case "location":
        if (!trimmedValue) return "Location is required.";
        if (trimmedValue.length < 2) return "Enter a valid location.";
        return "";
      case "experience":
        if (!trimmedValue) return "";
        if (Number.isNaN(Number(trimmedValue))) return "Experience must be a number.";
        if (Number(trimmedValue) < 0) return "Experience cannot be negative.";
        if (Number(trimmedValue) > 50) return "Enter a realistic experience value.";
        return "";
      case "noticePeriod":
        if (!trimmedValue) return "";
        if (trimmedValue.length < 2) return "Enter a valid notice period.";
        if (trimmedValue.length > 30) return "Notice period is too long.";
        return "";
      case "currentCTC":
        if (!trimmedValue) return "";
        if (!ctcRegex.test(trimmedValue)) return "Enter a valid current CTC.";
        return "";
      case "expectedCTC":
        if (!trimmedValue) return "";
        if (!ctcRegex.test(trimmedValue)) return "Enter a valid expected CTC.";
        return "";
      case "linkedin":
        return validateUrl(trimmedValue, "LinkedIn");
      case "portfolio":
        return validateUrl(trimmedValue, "portfolio");
      case "github":
        return validateUrl(trimmedValue, "GitHub");
      case "socialLinks":
        if (!trimmedValue) return "";
        if (trimmedValue.length < 5) return "Enter a valid social link.";
        if (trimmedValue.length > 250) return "Social links text is too long.";
        return "";
      case "resume":
        if (!value) return "Please upload your resume.";
        if (value.size > 5 * 1024 * 1024) return "Resume must be less than 5MB.";
        if (!/\.(pdf|doc|docx)$/i.test(value.name)) {
          return "Resume must be a PDF, DOC, or DOCX file.";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    Object.entries(formData).forEach(([name, value]) => {
      const error = validateField(name, value);

      if (error) {
        nextErrors[name] = error;
      }
    });

    return nextErrors;
  };

  /* FETCH JOB DETAILS */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(buildApiUrl(`Jobs/public/${id}`), {
          headers: { "ngrok-skip-browser-warning": "true" },
        });

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJob();
  }, [id]);

  useEffect(() => {
    if (!successMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setSuccessMessage("");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [successMessage]);

  /* HANDLE INPUT CHANGE */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "resume") {
      const file = files[0];

      if (!file) {
        setFormData({ ...formData, resume: null });
        setFormErrors((current) => ({
          ...current,
          resume: validateField("resume", null),
        }));
        return;
      }

      const resumeError = validateField("resume", file);

      setFormErrors((current) => ({
        ...current,
        resume: resumeError,
      }));

      if (resumeError) {
        return;
      }

      setErrorMessage("");
      setFormData({ ...formData, resume: file });
    } else {
      let nextValue = value;

      if (name === "phone") {
        nextValue = value.replace(/\D/g, "").slice(0, 10);
      }

      if (name === "fullName") {
        nextValue = value.replace(/[^A-Za-z\s.'-]/g, "");
      }

      if (name === "experience") {
        nextValue = value === "" ? "" : value.replace(/[^0-9.]/g, "");
      }

      setFormData({ ...formData, [name]: nextValue });
      setFormErrors((current) => ({
        ...current,
        [name]: validateField(name, nextValue),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const value = name === "resume" ? formData.resume : formData[name];

    setFormErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }));
  };

  /* SUBMIT APPLICATION */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    const nextErrors = validateForm();

    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setErrorMessage("Please correct the highlighted fields before submitting.");
      setLoading(false);
      return;
    }

    const form = new FormData();

    form.append("JobId", id);
    form.append("Name", formData.fullName);
    form.append("Email", formData.email);
    form.append("PhoneNumber", formData.phone);
    form.append("Gender", formData.gender);
    form.append("TotalExperience", formData.experience);
    form.append("CurrentCTC", formData.currentCTC);
    form.append("ExpectedCTC", formData.expectedCTC);
    form.append("NoticePeriod", formData.noticePeriod);
    form.append("CurrentLocation", formData.location);
    form.append("LinkedInUrl", formData.linkedin);
    form.append("PortfolioUrl", formData.portfolio);
    form.append("GitHubUrl", formData.github);
    form.append("SocialMediaLinks", formData.socialLinks);
    form.append("Resume", formData.resume);

    try {
      const response = await fetch(JOB_APPLICATIONS_API, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: form,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Application submission failed");
      }

      setSuccessMessage("Application submitted successfully!");
      window.scrollTo({ top: 0, behavior: "smooth" });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        experience: "",
        currentCTC: "",
        expectedCTC: "",
        noticePeriod: "",
        location: "",
        linkedin: "",
        portfolio: "",
        github: "",
        socialLinks: "",
        resume: null,
      });
      setFormErrors({});

    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-shell">
          <div className="job-details-loading">Loading role details...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-shell">
        <section className="job-details-card-shell">
          <div className="job-details-hero">
            <div className="job-details-copy">
              <Link to="/careers" className="job-back-link" aria-label="Back to careers">
                <FaArrowLeft aria-hidden="true" />
              </Link>

              <div className="job-hero-topline">
                <span className="eyebrow">Open position - Apply now</span>
              </div>

              <h1>{job.jobTitle}</h1>
              <p>{job.jobDescription || "Step into a role built for people who move with clarity, care deeply about craft, and like turning momentum into polished work."}</p>

              {splitSkills(job.mandatorySkills).length > 0 && (
                <div className="job-inline-skills">
                  <span className="job-inline-label">Required skills</span>
                  <div className="job-inline-skill-list">
                    {splitSkills(job.mandatorySkills).map((skill) => (
                      <span key={skill} className="job-inline-skill-pill">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="job-hero-summary">
                {detailItems.map((item) => (
                  <div key={item.key} className="job-summary-item">
                    <span>{item.label}</span>
                    <strong>{job[item.key] || item.fallback}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="job-details-content">
            <div className="application-panel" id="application-form">
            <div className="application-panel-header">
              <h2>Send your application</h2>
              <p>Complete the sections below. The form is compact, quick to scan, and designed to feel lighter while you apply.</p>
            </div>

            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            <form className="application-form-vertical" onSubmit={handleSubmit}>
              <div className="application-sections">
                {formSections.map((section, sectionIndex) => (
                  <section
                    key={section.title}
                    className="form-section-card"
                    style={{ animationDelay: `${0.08 + sectionIndex * 0.1}s` }}
                  >
                    <div className="form-section-head">
                      <span className="form-section-step">0{sectionIndex + 1}</span>
                      <div>
                        <h3>{section.title}</h3>
                        <p>{section.description}</p>
                      </div>
                    </div>

                    <div className="application-grid">
                      {section.fields.map((field, fieldIndex) => (
                        <div
                          key={field.id}
                          className={`form-group ${field.full ? "form-group-full" : ""}`}
                          style={{ animationDelay: `${0.18 + sectionIndex * 0.12 + fieldIndex * 0.04}s` }}
                        >
                          <label htmlFor={field.id}>{field.label}</label>

                          {field.type === "select" ? (
                            <select
                              id={field.id}
                              name={field.name}
                              value={formData[field.name]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required={field.required}
                              className={formErrors[field.name] ? "field-invalid" : ""}
                            >
                              <option value="">Select</option>
                              {field.options.map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              id={field.id}
                              type={field.type}
                              name={field.name}
                              value={field.type === "file" ? undefined : formData[field.name]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required={field.required}
                              accept={field.type === "file" ? ".pdf,.doc,.docx" : undefined}
                              className={formErrors[field.name] ? "field-invalid" : ""}
                              inputMode={field.inputMode}
                              maxLength={field.maxLength}
                              min={field.min}
                              max={field.max}
                              step={field.step}
                            />
                          )}

                          {field.type === "file" && (
                            <small>Accepted formats: PDF, DOC, DOCX. Max size: 5MB.</small>
                          )}

                          {formErrors[field.name] && (
                            <small className="field-error">{formErrors[field.name]}</small>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <button type="submit" className="apply-btn submit-application-btn" disabled={loading}>
                {loading ? "Submitting..." : "Submit Application"}
              </button>

              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
            </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetails;
