import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";

const ADMIN_API = buildApiUrl("Admin");
const ADMIN_ENDPOINTS = {
  login: `${ADMIN_API}/login`,
  register: `${ADMIN_API}/register`,
  admins: `${ADMIN_API}/admins`,
  deleteAdmin: (id) => `${ADMIN_API}/delete-admin/${id}`,
  dashboardSummary: `${ADMIN_API}/dashboard-summary`,
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
const [statusMessage, setStatusMessage] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const [saving, setSaving] = useState(false);

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

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();
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

<input
name="username"
placeholder="Username"
value={form.username}
onChange={handleChange}
/>

<input
name="email"
placeholder="Email"
value={form.email}
onChange={handleChange}
/>

<input
type="password"
name="password"
placeholder="Password"
value={form.password}
onChange={handleChange}
/>

<button type="submit">
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
