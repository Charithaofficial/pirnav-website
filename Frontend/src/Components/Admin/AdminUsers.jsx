import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
import { LIMITS, validateEmail } from "../../utils/formValidation";

const ADMIN_API = buildApiUrl("Admin");
const EMAIL_MAX_LENGTH = LIMITS.emailMax;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;
const ADMIN_ENDPOINTS = {
  login: `${ADMIN_API}/login`,
  register: `${ADMIN_API}/register`,
  admins: `${ADMIN_API}/admins`,
  deleteAdmin: (id) => `${ADMIN_API}/delete-admin/${id}`,
  dashboardSummary: `${ADMIN_API}/dashboard-summary`,
};

const getUsernameError = (value) => {
const trimmedValue = value.trim();

if (!trimmedValue) {
return "Username is required";
}

if (trimmedValue.length < 2) {
return "Username must be at least 2 characters";
}

if (trimmedValue.length > 80) {
return "Username must be 80 characters or less";
}

return "";
};

const getEmailError = (value) => {
const trimmedValue = value.trim();

if (!trimmedValue) {
return "Email is required";
}

if (trimmedValue.length > EMAIL_MAX_LENGTH) {
return `Email must be ${EMAIL_MAX_LENGTH} characters or less`;
}

return validateEmail(trimmedValue) ? "Enter a valid email address" : "";
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

const AdminUsers = () => {
const navigate = useNavigate();

const [form,setForm] = useState({
username:"",
email:"",
password:""
});
const [admins, setAdmins] = useState([]);
const [summary, setSummary] = useState({});
const [formErrors, setFormErrors] = useState({});
const [statusMessage, setStatusMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [saving, setSaving] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const passwordStrength = getPasswordStrength(form.password);

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

const normalizeAdmin = (item) => ({
id: item.id ?? item.adminId ?? item.userId ?? item.email,
username: item.username ?? item.name ?? item.userName ?? "Admin",
email: item.email ?? "No email",
status: item.status ?? "Active",
});

const fetchAdmins = async () => {
try {
const response = await fetch(ADMIN_ENDPOINTS.admins, {
headers: getHeaders(),
});

if (response.status === 401) {
navigate("/admin-login");
return;
}

if (!response.ok) {
throw new Error("Failed to fetch admin users");
}

const data = await response.json();
const list = Array.isArray(data) ? data : data?.data || data?.admins || [];
setAdmins(list.map(normalizeAdmin));
} catch (error) {
console.error("Admin users fetch error:", error);
}
};

const fetchDashboardSummary = async () => {
try {
const response = await fetch(ADMIN_ENDPOINTS.dashboardSummary, {
headers: getHeaders(),
});

if (!response.ok) return;

const data = await response.json();
setSummary(data?.data || data || {});
} catch (error) {
console.error("Dashboard summary fetch error:", error);
}
};

useEffect(() => {
fetchAdmins();
fetchDashboardSummary();
}, []);

const getFieldError = (name, value) => {
if (name === "username") return getUsernameError(value);
if (name === "email") return getEmailError(value);
if (name === "password") return getPasswordError(value);

return "";
};

const validateForm = () => {
const nextErrors = {
username: getUsernameError(form.username),
email: getEmailError(form.email),
password: getPasswordError(form.password),
};

Object.keys(nextErrors).forEach((key) => {
if (!nextErrors[key]) {
delete nextErrors[key];
}
});

setFormErrors(nextErrors);
return Object.keys(nextErrors).length === 0;
};

const handleChange=(e)=>{
const { name, value } = e.target;
const fieldError = getFieldError(name, value);

setForm((current) => ({...current,[name]:value}));
setFormErrors((current) => ({
...current,
[name]: fieldError,
}));
setStatusMessage("");
setErrorMessage("");
};

const handleSubmit=async(e)=>{
e.preventDefault();
if (!validateForm()) return;

setSaving(true);
setStatusMessage("");
setErrorMessage("");

try {
const response = await fetch(ADMIN_ENDPOINTS.register, {
method:"POST",
headers:getHeaders(),
body:JSON.stringify(form),
});

if (response.status === 401) {
navigate("/admin-login");
return;
}

if (!response.ok) {
throw new Error("Failed to register admin user");
}

setStatusMessage("Admin user registered successfully.");
setForm({
username:"",
email:"",
password:""
});
setFormErrors({});
fetchAdmins();
fetchDashboardSummary();
} catch (error) {
setErrorMessage(error.message);
} finally {
setSaving(false);
}
};

const handleDelete = async (id) => {
try {
setErrorMessage("");
setStatusMessage("");

const response = await fetch(ADMIN_ENDPOINTS.deleteAdmin(id), {
method:"DELETE",
headers:getHeaders(),
});

if (response.status === 401) {
navigate("/admin-login");
return;
}

if (!response.ok) {
throw new Error("Failed to delete admin user");
}

setStatusMessage("Admin user deleted successfully.");
fetchAdmins();
fetchDashboardSummary();
} catch (error) {
setErrorMessage(error.message);
}
};

return(

<div className="admin-users-page">

<div className="page-header">
<h2>Admin Users</h2>
<p>Create and manage admin accounts</p>
</div>

<div className="admin-users-grid">

<div className="user-form-card">

<h3>Register Admin User</h3>

<form onSubmit={handleSubmit}>

<label className="admin-user-form-field" htmlFor="admin-register-username">
<span>Username</span>
<input
id="admin-register-username"
name="username"
placeholder="Username"
maxLength={80}
value={form.username}
onChange={handleChange}
aria-invalid={Boolean(formErrors.username)}
aria-describedby={formErrors.username ? "admin-register-username-error" : undefined}
/>
{formErrors.username && (
<small id="admin-register-username-error" className="admin-inline-error">{formErrors.username}</small>
)}
</label>

<label className="admin-user-form-field" htmlFor="admin-register-email">
<span>Email</span>
<input
id="admin-register-email"
name="email"
type="text"
inputMode="email"
autoComplete="username"
placeholder="Enter your email"
maxLength={EMAIL_MAX_LENGTH}
value={form.email}
onChange={handleChange}
aria-invalid={Boolean(formErrors.email)}
aria-describedby={formErrors.email ? "admin-register-email-error" : undefined}
/>
{formErrors.email && (
<small id="admin-register-email-error" className="admin-inline-error">{formErrors.email}</small>
)}
</label>

<label className="admin-user-form-field" htmlFor="admin-register-password">
<span>Password</span>
<div className="password-input-wrap">
<input
id="admin-register-password"
type={showPassword ? "text" : "password"}
name="password"
placeholder="Enter your password"
autoComplete="new-password"
minLength={PASSWORD_MIN_LENGTH}
maxLength={PASSWORD_MAX_LENGTH}
value={form.password}
onChange={handleChange}
aria-invalid={Boolean(formErrors.password)}
aria-describedby={formErrors.password ? "admin-register-password-error" : undefined}
/>
<button
type="button"
className="password-toggle-btn"
onClick={() => setShowPassword((current) => !current)}
aria-label={showPassword ? "Hide password" : "Show password"}
>
{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
</button>
</div>
{formErrors.password && (
<small id="admin-register-password-error" className="admin-inline-error">{formErrors.password}</small>
)}
{passwordStrength && (
<small className={`password-strength ${passwordStrength}`}>
Password strength: {passwordStrength}
</small>
)}
</label>

<button type="submit" disabled={saving}>
{saving ? "Registering..." : "Register User"}
</button>

</form>

{statusMessage && <p className="admin-users-status success">{statusMessage}</p>}
{errorMessage && <p className="admin-users-status error">{errorMessage}</p>}

</div>

<div className="users-table-card">

<h3>Admin Users</h3>

<table>

<thead>
<tr>
<th>Username</th>
<th>Email</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>

<tbody>
{admins.length === 0 ? (
<tr>
<td colSpan="4">No admin users found.</td>
</tr>
) : admins.map((admin) => (
<tr key={admin.id}>
<td>{admin.username}</td>
<td>{admin.email}</td>
<td>{admin.status}</td>
<td>
<button
type="button"
className="admin-delete-btn"
onClick={() => handleDelete(admin.id)}
>
Delete
</button>
</td>
</tr>
))}

</tbody>

</table>

</div>

</div>
</div>

);

};

export default AdminUsers;
