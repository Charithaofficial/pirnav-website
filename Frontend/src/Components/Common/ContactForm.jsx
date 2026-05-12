import { useEffect, useMemo, useState } from "react";
import {
  hasErrors,
  LIMITS,
  normalizeEmailInput,
  sanitizeFormPayload,
  validateContactForm,
} from "../../utils/formValidation";
import "./ContactForm.css";
import { buildApiUrl, jsonApiHeaders } from "../../config/api";

const CONTACT_API = buildApiUrl("Contact");

const defaultValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactForm({
  title = "Get In Touch",
  description = "Share your details below and our team will get back to you as soon as possible.",
  buttonLabel = "Send Message",
  compact = false,
  className = "",
  formId,
}) {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState(defaultValues);
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");

  const visibleErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, touched[key] ? value : ""])
      ),
    [errors, touched]
  );

  useEffect(() => {
    if (status !== "success") {
      return undefined;
    }

    const timeoutId = setTimeout(() => setStatus(""), 2500);
    return () => clearTimeout(timeoutId);
  }, [status]);

  const updateField = (name, value) => {
    const nextValue = name === "email" ? normalizeEmailInput(value) : value;
    const nextValues = { ...formData, [name]: nextValue };
    setFormData(nextValues);
    setErrors(validateContactForm(nextValues));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    updateField(name, value);

    if (name === "email" && value.trim()) {
      setTouched((current) => ({ ...current, email: true }));
    }

    if (name === "name" && value.trim().length >= 3) {
      setTouched((current) => ({ ...current, name: true }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors(validateContactForm(formData));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateContactForm(formData);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });
    setErrors(nextErrors);

    if (hasErrors(nextErrors)) {
      setStatus("");
      return;
    }

    setLoading(true);
    setStatus("");
    setSubmitMessage("");

    try {
      const payload = sanitizeFormPayload(formData);
      const response = await fetch(CONTACT_API, {
        method: "POST",
        headers: jsonApiHeaders,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Something went wrong. Please try again.";
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.message ||
            Object.values(errorData.errors || {})[0] ||
            errorMessage;
        } catch {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      await response.json();
      setStatus("success");
      setSubmitMessage("");
      setFormData(defaultValues);
      setErrors(defaultValues);
      setTouched({});
    } catch (error) {
      setSubmitMessage(error.message || "Something went wrong. Please try again.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`shared-contact-form-shell ${compact ? "shared-contact-form-compact" : ""} ${className}`.trim()}
      id={formId}
    >
      <div className="shared-contact-form-header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <form className="shared-contact-form" onSubmit={handleSubmit} noValidate>
        <div className="shared-contact-grid shared-contact-grid-two">
          <label className="shared-contact-field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              maxLength={LIMITS.nameMax}
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(visibleErrors.name)}
            />
            {visibleErrors.name ? <small>{visibleErrors.name}</small> : null}
          </label>

          <label className="shared-contact-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              maxLength={LIMITS.emailMax}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(visibleErrors.email)}
            />
            {visibleErrors.email ? <small>{visibleErrors.email}</small> : null}
          </label>
        </div>

        <label className="shared-contact-field">
          <span>Subject</span>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            maxLength={LIMITS.subjectMax}
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(visibleErrors.subject)}
          />
          {visibleErrors.subject ? <small>{visibleErrors.subject}</small> : null}
        </label>

        <label className="shared-contact-field">
          <span>Message</span>
          <textarea
            name="message"
            rows="6"
            placeholder="Tell us what you need"
            maxLength={LIMITS.messageMax}
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(visibleErrors.message)}
          />
          {visibleErrors.message ? <small>{visibleErrors.message}</small> : null}
        </label>

        <button type="submit" disabled={loading || Boolean(errors.email)}>
          {loading ? "Sending..." : buttonLabel}
        </button>

        {status === "error" ? (
          <p className="shared-contact-status shared-contact-status-error">
            {submitMessage || "Something went wrong. Please try again."}
          </p>
        ) : null}

        {status === "success" ? (
          <p className="shared-contact-status shared-contact-status-success">
            Message sent successfully!
          </p>
        ) : null}
      </form>
    </div>
  );
}

export default ContactForm;
