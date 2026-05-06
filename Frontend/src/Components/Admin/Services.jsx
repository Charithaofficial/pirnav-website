import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Globe,
} from "lucide-react";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";

const API_BASE = buildApiUrl("Services");

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "active",
  });

  useEffect(() => {
    fetchServices();
  }, []);

  // ✅ GET SERVICES
  const fetchServices = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        alert("Please login again");
        return;
      }

      const response = await fetch(API_BASE, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        alert("Session expired. Login again.");
        return;
      }

      if (!response.ok) throw new Error("Failed");

      const data = await response.json();
      setServices(Array.isArray(data) ? data : data.data || []);

    } catch (err) {
      console.error(err);
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filtered = services.filter(
    (s) =>
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      status: "active",
    });
    setShowModal(true);
  };

  const openEdit = (service) => {
    setEditing(service);
    setForm({
      title: service.title,
      description: service.description,
      status: service.isActive ? "active" : "inactive",
    });
    setShowModal(true);
  };

  // ✅ CREATE / UPDATE
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `${API_BASE}/${editing.id}`
        : API_BASE;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          isActive: form.status === "active",
        }),
      });

      if (!response.ok) throw new Error("Save failed");

      setShowModal(false);
      fetchServices();

    } catch (err) {
      console.error(err);
      alert("Failed to save service");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      const response = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Delete failed");

      fetchServices();

    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  return (
    <div className="services-wrapper">

      <div className="services-header">
        <h1>Services</h1>
        <button className="add-btn" onClick={openCreate}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}

      <table className="services-table">
        <thead>
          <tr>
            <th>Service</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((service) => (
            <tr key={service.id}>
              <td className="service-cell">
                <Globe size={16} />
                {service.title}
              </td>

              <td>{service.description}</td>

              <td>
                <span
                  className={`status-badge ${
                    service.isActive ? "active" : "inactive"
                  }`}
                >
                  {service.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                {service.createdDate
                  ? new Date(service.createdDate).toLocaleDateString()
                  : ""}
              </td>

              <td>
                <button onClick={() => openEdit(service)}>
                  <Pencil size={14} />
                </button>

                <button onClick={() => handleDelete(service.id)}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editing ? "Edit Service" : "Add Service"}</h3>

            <input
              placeholder="Service Name"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={handleSave}
                disabled={!form.title.trim()}
              >
                {editing ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
