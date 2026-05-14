import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Save, User } from "lucide-react";
import { buildApiUrl } from "../../config/api";
import { LIMITS, normalizeEmailInput, validateEmail } from "../../utils/formValidation";
import "./Admin.css";

const ADMIN_INFO_API = {
  profile: buildApiUrl("Admin/profile"),
  updateProfile: buildApiUrl("Admin/update-profile"),
  changePassword: buildApiUrl("Admin/change-password"),
};

const ADMIN_PROFILE_STORAGE_KEY = "adminProfile";
const ADMIN_PROFILE_UPDATED_EVENT = "admin-profile-updated";

const pageConfig = {
  profile: {
    title: "My Profile",
    subtitle: "Update the administrator profile information shown across the dashboard.",
    icon: User,
    buttonLabel: "Save Profile",
    successText: "Profile saved successfully.",
    fields: [
      { name: "username", label: "Username", type: "text", value: "" },
      { name: "email", label: "Email Address", type: "email", value: "" },
      { name: "role", label: "Role", type: "text", value: "", readOnly: true },
    ],
  },
  password: {
    title: "Change Password",
    subtitle: "Set a new password for secure admin dashboard access.",
    icon: LockKeyhole,
    buttonLabel: "Update Password",
    successText: "Password update request sent.",
    fields: [
      { name: "currentPassword", label: "Current Password", type: "password", value: "" },
      { name: "newPassword", label: "New Password", type: "password", value: "" },
      { name: "confirmPassword", label: "Confirm Password", type: "password", value: "" },
    ],
  },
};

const buildInitialValues = (fields) =>
  Object.fromEntries(fields.map((field) => [field.name, field.value]));

const getHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getResponseMessage = async (response, fallback) => {
  const data = await response.json().catch(() => null);
  return {
    data,
    message:
      data?.message ||
      data?.Message ||
      Object.values(data?.errors || {})[0] ||
      fallback,
  };
};

const publishProfileUpdate = (profile) => {
  const normalizedProfile = {
    username: profile.username || profile.Username || "Admin",
    email: profile.email || profile.Email || "admin@example.com",
    role: profile.role || profile.Role || "Administrator",
  };

  localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(normalizedProfile));
  window.dispatchEvent(
    new CustomEvent(ADMIN_PROFILE_UPDATED_EVENT, {
      detail: normalizedProfile,
    })
  );
};

function AdminInfoPage({ type }) {
  const content = pageConfig[type] || pageConfig.profile;
  const Icon = content.icon;
  const initialValues = useMemo(() => buildInitialValues(content.fields), [content]);
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(type === "profile");
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const updateField = (name, value) => {
    const nextValue = name === "email" ? normalizeEmailInput(value) : value;
    setValues((current) => ({ ...current, [name]: nextValue }));
    setFieldErrors((current) => ({
      ...current,
      [name]: name === "email" ? validateEmail(nextValue) : "",
    }));
    setStatus("");
  };

  const togglePasswordVisibility = (name) => {
    setVisiblePasswords((current) => ({
      ...current,
      [name]: !current[name],
    }));
  };

  useEffect(() => {
    setValues(initialValues);
    setStatus("");
    setFieldErrors({});
    setFieldTouched({});
  }, [initialValues]);

  useEffect(() => {
    if (type !== "profile") {
      setLoadingProfile(false);
      return;
    }

    let active = true;

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setStatus("");

      try {
        const response = await fetch(ADMIN_INFO_API.profile, {
          method: "GET",
          headers: getHeaders(),
        });
        const { data, message } = await getResponseMessage(
          response,
          "Unable to load profile."
        );

        if (!response.ok || data?.success === false) {
          throw new Error(message);
        }

        const profile = data?.data || data || {};

        if (!active) return;

        setValues({
          username: profile.username || profile.Username || "",
          email: normalizeEmailInput(profile.email || profile.Email || ""),
          role: profile.role || profile.Role || "",
        });
        publishProfileUpdate(profile);
      } catch (error) {
        if (active) {
          setStatus(error.message || "Unable to load profile.");
        }
      } finally {
        if (active) {
          setLoadingProfile(false);
        }
      }
    };

    fetchProfile();

    return () => {
      active = false;
    };
  }, [type]);

  const buildSubmitRequest = () => {
    if (type === "profile") {
      return {
        url: ADMIN_INFO_API.updateProfile,
        method: "PUT",
        payload: {
          username: values.username,
          email: normalizeEmailInput(values.email),
        },
      };
    }

    return {
      url: ADMIN_INFO_API.changePassword,
      method: "POST",
      payload: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (type === "profile") {
      const emailError = validateEmail(values.email);
      setFieldTouched((current) => ({ ...current, email: true }));
      setFieldErrors((current) => ({ ...current, email: emailError }));

      if (emailError) {
        setStatus("");
        return;
      }
    }

    setLoading(true);
    setStatus("");

    try {
      const request = buildSubmitRequest();
      const response = await fetch(request.url, {
        method: request.method,
        headers: getHeaders(),
        body: JSON.stringify(request.payload),
      });
      const { data, message } = await getResponseMessage(
        response,
        "Unable to save changes."
      );

      if (!response.ok || data?.success === false) {
        throw new Error(message);
      }

      if (type === "profile") {
        const profile = data?.data || {};
        setValues((current) => {
          const mergedValues = {
            ...current,
            username: profile.username || current.username,
            email: normalizeEmailInput(profile.email || current.email),
            role: profile.role || current.role,
          };

          publishProfileUpdate(mergedValues);
          return mergedValues;
        });
      } else {
        setValues(initialValues);
      }

      setStatus(data?.message || content.successText);
    } catch (error) {
      setStatus(error.message || "Unable to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-info-page">
      <div className="admin-info-card">
        <div className="admin-info-header">
          <span className="admin-info-icon">
            <Icon size={22} aria-hidden="true" />
          </span>
          <div>
            <h1>{content.title}</h1>
            <p>{content.subtitle}</p>
          </div>
        </div>

        <form className="admin-info-form" onSubmit={handleSubmit}>
          <div className="admin-info-form-grid">
            {content.fields.map((field) => {
              const fieldError = fieldTouched[field.name] ? fieldErrors[field.name] : "";
              return (
              <label
                key={field.name}
                className={`admin-info-field ${field.type === "textarea" ? "admin-info-field-full" : ""}`}
              >
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    rows="5"
                    value={values[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  />
                ) : field.type === "select" ? (
                  <select
                    value={values[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  field.type === "password" ? (
                    <div className="password-input-wrap">
                      <input
                        type={visiblePasswords[field.name] ? "text" : "password"}
                        value={values[field.name] || ""}
                        onChange={(event) => updateField(field.name, event.target.value)}
                        disabled={loadingProfile}
                      />
                      <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => togglePasswordVisibility(field.name)}
                        aria-label={visiblePasswords[field.name] ? `Hide ${field.label}` : `Show ${field.label}`}
                      >
                        {visiblePasswords[field.name] ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={values[field.name] || ""}
                      onChange={(event) => updateField(field.name, event.target.value)}
                      onBlur={() => setFieldTouched((current) => ({ ...current, [field.name]: true }))}
                      maxLength={field.name === "email" ? LIMITS.emailMax : undefined}
                      aria-invalid={Boolean(fieldError)}
                      readOnly={field.readOnly}
                      disabled={field.readOnly || loadingProfile}
                    />
                  )
                )}
                {fieldError ? <small className="admin-info-field-error">{fieldError}</small> : null}
              </label>
              );
            })}
          </div>

          <div className="admin-info-actions">
            {status ? <p>{status}</p> : <span>{loadingProfile ? "Loading profile..." : ""}</span>}
            <button type="submit" disabled={loading || loadingProfile || Boolean(fieldErrors.email)}>
              <Save size={18} />
              {loading ? "Saving..." : content.buttonLabel}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default AdminInfoPage;
