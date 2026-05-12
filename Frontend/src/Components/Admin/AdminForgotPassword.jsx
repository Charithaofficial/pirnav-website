import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
import { LIMITS, normalizeEmailInput, validateEmail } from "../../utils/formValidation";
import logo from "../../assets/logo.png";

const SEND_OTP_API = buildApiUrl("Admin/send-otp");
const RESET_PASSWORD_API = buildApiUrl("Admin/reset-password");
const EMAIL_MAX_LENGTH = LIMITS.emailMax;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const getEmailError = (value) => {
  const trimmedValue = normalizeEmailInput(value);

  if (!trimmedValue) {
    return "Email is required";
  }

  if (trimmedValue.length > EMAIL_MAX_LENGTH) {
    return `Email must be ${EMAIL_MAX_LENGTH} characters or less`;
  }

  return validateEmail(trimmedValue);
};

const getOtpError = (value) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "OTP is required";
  }

  if (!/^\d{4,8}$/.test(trimmedValue)) {
    return "Enter a valid OTP";
  }

  return "";
};

const getPasswordError = (value) => {
  if (!value.trim()) {
    return "New password is required";
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or less`;
  }

  return "";
};

const getConfirmPasswordError = (value, password) => {
  if (!value.trim()) {
    return "Confirm password is required";
  }

  if (value !== password) {
    return "Passwords do not match";
  }

  return "";
};

const getPasswordStrength = (value) => {
  if (!value) {
    return "";
  }

  const strengthChecks = [
    value.length >= PASSWORD_MIN_LENGTH,
    /[a-z]/.test(value),
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
    value.length >= 12,
  ];
  const score = strengthChecks.filter(Boolean).length;

  if (score >= 5) {
    return "strong";
  }

  if (score >= 3) {
    return "medium";
  }

  return "weak";
};

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const passwordStrength = getPasswordStrength(newPassword);

  const handleSendOtp = async () => {
    const emailError = getEmailError(email);
    setErrors({ email: emailError });
    setMessage("");

    if (emailError) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(SEND_OTP_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ email: normalizeEmailInput(email) }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors({ api: data?.message || data?.error || "Unable to send OTP." });
        return;
      }

      setOtpSent(true);
      setMessage(data?.message || "OTP sent successfully.");
    } catch {
      setErrors({ api: "Server not reachable." });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const nextErrors = {
      email: getEmailError(email),
      otp: getOtpError(otp),
      newPassword: getPasswordError(newPassword),
      confirmPassword: getConfirmPasswordError(confirmPassword, newPassword),
    };

    Object.keys(nextErrors).forEach((key) => {
      if (!nextErrors[key]) {
        delete nextErrors[key];
      }
    });

    setErrors(nextErrors);
    setMessage("");

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(RESET_PASSWORD_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: normalizeEmailInput(email),
          otp: otp.trim(),
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setErrors({ api: data?.message || data?.error || "Invalid OTP or reset request." });
        return;
      }

      navigate("/admin-login", {
        replace: true,
        state: { message: data?.message || "Password reset successfully. Please login." },
      });
    } catch {
      setErrors({ api: "Server not reachable." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (otpSent) {
      handleResetPassword();
      return;
    }

    handleSendOtp();
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-left">
        <img src={logo} alt="Pirnav Logo" className="admin-login-logo" />
        <p>Admin Dashboard Access Portal</p>
      </div>

      <div className="admin-right">
        <div className="admin-card admin-forgot-card">
          <h2>Forgot Password</h2>
          <p className="admin-card-subtitle">
            Enter your admin email, verify the OTP, and set a new password.
          </p>

          <form onSubmit={handleSubmit}>
            {!otpSent && (
              <div className="form-group">
                <label htmlFor="admin-forgot-email">Email</label>
                <input
                  id="admin-forgot-email"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  placeholder="Enter your email"
                  maxLength={EMAIL_MAX_LENGTH}
                  value={email}
                  onChange={(event) => {
                    const nextEmail = normalizeEmailInput(event.target.value);

                    setEmail(nextEmail);
                    setErrors((current) => ({
                      ...current,
                      email: getEmailError(nextEmail),
                      api: "",
                    }));
                    setMessage("");
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "admin-forgot-email-error" : undefined}
                />
                {errors.email && (
                  <small id="admin-forgot-email-error" className="error-text">{errors.email}</small>
                )}
              </div>
            )}

            {otpSent && (
              <>
                <div className="form-group">
                  <label htmlFor="admin-forgot-otp">OTP</label>
                  <input
                    id="admin-forgot-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(event) => {
                      const nextOtp = event.target.value;

                      setOtp(nextOtp);
                      setErrors((current) => ({
                        ...current,
                        otp: getOtpError(nextOtp),
                        api: "",
                      }));
                    }}
                    aria-invalid={Boolean(errors.otp)}
                    aria-describedby={errors.otp ? "admin-forgot-otp-error" : undefined}
                  />
                  {errors.otp && (
                    <small id="admin-forgot-otp-error" className="error-text">{errors.otp}</small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="admin-forgot-new-password">New Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="admin-forgot-new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      value={newPassword}
                      onChange={(event) => {
                        const nextPassword = event.target.value;

                        setNewPassword(nextPassword);
                        setErrors((current) => ({
                          ...current,
                          newPassword: getPasswordError(nextPassword),
                          confirmPassword: confirmPassword
                            ? getConfirmPasswordError(confirmPassword, nextPassword)
                            : current.confirmPassword,
                          api: "",
                        }));
                      }}
                      aria-invalid={Boolean(errors.newPassword)}
                      aria-describedby={errors.newPassword ? "admin-forgot-new-password-error" : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowNewPassword((current) => !current)}
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <small id="admin-forgot-new-password-error" className="error-text">{errors.newPassword}</small>
                  )}
                  {passwordStrength && (
                    <small className={`password-strength ${passwordStrength}`}>
                      Password strength: {passwordStrength}
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="admin-forgot-confirm-password">Confirm New Password</label>
                  <div className="password-input-wrap">
                    <input
                      id="admin-forgot-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      value={confirmPassword}
                      onChange={(event) => {
                        const nextConfirmPassword = event.target.value;

                        setConfirmPassword(nextConfirmPassword);
                        setErrors((current) => ({
                          ...current,
                          confirmPassword: getConfirmPasswordError(nextConfirmPassword, newPassword),
                          api: "",
                        }));
                      }}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? "admin-forgot-confirm-password-error" : undefined}
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowConfirmPassword((current) => !current)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <small id="admin-forgot-confirm-password-error" className="error-text">{errors.confirmPassword}</small>
                  )}
                </div>
              </>
            )}

            {message && (
              <small className="success-text center">{message}</small>
            )}

            {errors.api && (
              <small className="error-text center">{errors.api}</small>
            )}

            <button type="submit" disabled={loading || Boolean(getEmailError(email))}>
              {loading ? "Please wait..." : otpSent ? "Validate OTP" : "Send OTP"}
            </button>
          </form>

          <div className="admin-login-links admin-forgot-back">
            <Link to="/admin-login">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
