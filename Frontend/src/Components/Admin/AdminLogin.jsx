import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
 
const API_BASE = buildApiUrl("Admin/login");
 
const AdminLogin = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
 
  const validate = () => {
    let newErrors = {};
 
    if (!identifier.trim()) {
      newErrors.identifier = "Email or username is required";
    }
 
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
 
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
          email: identifier.trim(),
          username: identifier.trim(),
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
        <h1>PIRNAV</h1>
        <p>Admin Dashboard Access Portal</p>
      </div>
 
      <div className="admin-right">
        <div className="admin-card">
          <h2>Admin Login</h2>
 
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Admin Email or Username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              {errors.identifier && (
                <small className="error-text">{errors.identifier}</small>
              )}
            </div>
 
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <small className="error-text">{errors.password}</small>
              )}
            </div>
 
            {errors.api && (
              <small className="error-text center">{errors.api}</small>
            )}
 
            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
 
export default AdminLogin;
