import { useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
import { LIMITS, normalizeEmailInput, validateEmail } from "../../utils/formValidation";
import logo from "../../assets/logo.png";
 
const API_BASE = buildApiUrl("Admin/login");
const EMAIL_MAX_LENGTH = LIMITS.emailMax;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const createCaptcha = () => {
  const first = Math.floor(Math.random() * 9) + 1;
  const second = Math.floor(Math.random() * 9) + 1;

  return {
    question: `${first} + ${second}`,
    answer: String(first + second),
  };
};

const getIdentifierError = (value) => {
  const trimmedValue = normalizeEmailInput(value);

  if (!trimmedValue) {
    return "Email is required";
  }

  if (trimmedValue.length > EMAIL_MAX_LENGTH) {
    return `Email must be ${EMAIL_MAX_LENGTH} characters or less`;
  }

  return validateEmail(trimmedValue);
};

const getPasswordError = (value) => {
  if (!value.trim()) {
    return "Password is required";
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }

  if (value.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or less`;
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

const getCaptchaError = (value, captcha) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "Captcha is required";
  }

  if (!/^\d+$/.test(trimmedValue)) {
    return "Enter numbers only";
  }

  if (trimmedValue !== captcha.answer) {
    return "Captcha is incorrect";
  }

  return "";
};
 
const AdminLogin = () => {
  const location = useLocation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(() => createCaptcha());
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(password);

  const refreshCaptcha = ({ clearApi = true } = {}) => {
    setCaptcha(createCaptcha());
    setCaptchaAnswer("");
    setErrors((current) => ({
      ...current,
      captcha: "",
      api: clearApi ? "" : current.api,
    }));
  };
 
  const validate = () => {
    const newErrors = {
      identifier: getIdentifierError(identifier),
      password: getPasswordError(password),
      captcha: getCaptchaError(captchaAnswer, captcha),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;
 
    setLoading(true);
    setErrors({});
 
    try {
      const response = await fetch(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          email: normalizeEmailInput(identifier),
          username: normalizeEmailInput(identifier),
          password,
        }),
      });
 
      const data = await response.json().catch(() => null);
 
      if (!response.ok) {
      setErrors({
        api:
          data?.message ||
          data?.error ||
          "Invalid credentials",
        });
        refreshCaptcha({ clearApi: false });
        setLoading(false);
        return;
      }

      const token = data?.data?.token || data?.token;

      if (!token) {
        setErrors({ api: "Login succeeded but no token was returned." });
        return;
      }
 
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminAuth", "true");
 
      navigate("/admin");
 
    } catch (error) {
      setErrors({ api: "Server not reachable." });
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="admin-wrapper">
      <div className="admin-left">
        <img src={logo} alt="Pirnav Logo" className="admin-login-logo" />
        <p>Admin Dashboard Access Portal</p>
      </div>
 
      <div className="admin-right">
        <div className="admin-card">
          <h2>Admin Login</h2>
          {location.state?.message && (
            <small className="success-text center">{location.state.message}</small>
          )}
 
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="admin-login-email">Email</label>
              <input
                id="admin-login-email"
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder="Enter your email"
                maxLength={EMAIL_MAX_LENGTH}
                value={identifier}
                onChange={(e) => {
                  const nextIdentifier = normalizeEmailInput(e.target.value);
                  const identifierError = getIdentifierError(nextIdentifier);

                  setIdentifier(nextIdentifier);
                  setErrors((current) => ({
                    ...current,
                    identifier: identifierError,
                    api: "",
                  }));
                }}
                aria-invalid={Boolean(errors.identifier)}
                aria-describedby={errors.identifier ? "admin-login-email-error" : undefined}
              />
              {errors.identifier && (
                <small id="admin-login-email-error" className="error-text">{errors.identifier}</small>
              )}
            </div>
 
            <div className="form-group">
              <label htmlFor="admin-login-password">Password</label>
              <div className="password-input-wrap">
                <input
                  id="admin-login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={PASSWORD_MAX_LENGTH}
                  value={password}
                  onChange={(e) => {
                    const nextPassword = e.target.value;
                    const passwordError = getPasswordError(nextPassword);

                    setPassword(nextPassword);
                    setErrors((current) => ({
                      ...current,
                      password: passwordError,
                      api: "",
                    }));
                  }}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "admin-login-password-error" : undefined}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {errors.password && (
                <small id="admin-login-password-error" className="error-text">{errors.password}</small>
              )}
              {passwordStrength && (
                <small className={`password-strength ${passwordStrength}`}>
                  Password strength: {passwordStrength}
                </small>
              )}
            </div>

            <div className="admin-login-links">
              <Link to="/admin-forgot-password">Forgot Password?</Link>
            </div>

            <div className="form-group">
              <label htmlFor="admin-login-captcha">Captcha</label>
              <div className="captcha-row">
                <div className="captcha-question" aria-label={`Captcha question ${captcha.question}`}>
                  {captcha.question} =
                </div>
                <button
                  type="button"
                  className="captcha-refresh-btn"
                  onClick={refreshCaptcha}
                  aria-label="Refresh captcha"
                >
                  <RefreshCw size={17} />
                </button>
              </div>
              <input
                id="admin-login-captcha"
                type="text"
                inputMode="numeric"
                placeholder="Enter captcha answer"
                value={captchaAnswer}
                onChange={(e) => {
                  const nextCaptchaAnswer = e.target.value;
                  const captchaError = getCaptchaError(nextCaptchaAnswer, captcha);

                  setCaptchaAnswer(nextCaptchaAnswer);
                  setErrors((current) => ({
                    ...current,
                    captcha: captchaError,
                    api: "",
                  }));
                }}
                aria-invalid={Boolean(errors.captcha)}
                aria-describedby={errors.captcha ? "admin-login-captcha-error" : undefined}
              />
              {errors.captcha && (
                <small id="admin-login-captcha-error" className="error-text">{errors.captcha}</small>
              )}
            </div>
 
            {errors.api && (
              <small className="error-text center">{errors.api}</small>
            )}
 
            <button type="submit" className="admin-login-submit-btn" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default AdminLogin;
