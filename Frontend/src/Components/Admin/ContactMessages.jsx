import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCircle2, Search, Eye, Trash2 } from "lucide-react";
import "./Admin.css";
import { buildApiUrl } from "../../config/api";
 
const API_BASE = buildApiUrl("Contact");

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.$values)) return data.$values;
  if (Array.isArray(data?.messages)) return data.messages;
  return [];
};

const normalizeStatus = (status) => String(status || "").toLowerCase();
 
const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
 
  const navigate = useNavigate();
 
  const getHeaders = () => {
    const token = localStorage.getItem("adminToken");
 
    if (!token) {
      navigate("/admin-login");
      return null;
    }
 
    return {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      Authorization: `Bearer ${token}`,
    };
  };
 
  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, []);
 
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      if (!headers) return;
      const res = await fetch(API_BASE, { headers });
      const data = await res.json();
      setMessages(normalizeList(data));
    } catch (err) {
      console.error("Load error", err);
    } finally {
      setLoading(false);
    }
  };
 
  const fetchUnreadCount = async () => {
    try {
      const headers = getHeaders();
      if (!headers) return;
      const res = await fetch(`${API_BASE}/unread-count`, { headers });
      if (!res.ok) return;
      const data = await res.json();
      setUnreadCount(data?.unread ?? 0);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };
 
  const openMessage = async (id) => {
    try {
      const headers = getHeaders();
      if (!headers) return;
      const res = await fetch(`${API_BASE}/${id}`, { headers });
      const data = await res.json();
      setSelected(data);
 
      if (normalizeStatus(data.status) === "unread") {
        await fetch(`${API_BASE}/mark-read/${id}`, {
          method: "PUT",
          headers,
        });
        await fetchMessages();
        await fetchUnreadCount();
      }
    } catch (err) {
      console.error("Open error", err);
    }
  };
 
  const markAsReplied = async (id) => {
    try {
      const headers = getHeaders();
      if (!headers) return;
      const response = await fetch(`${API_BASE}/mark-replied/${id}`, {
        method: "PUT",
        headers,
      });
      if (!response.ok) {
        throw new Error("Unable to mark message as replied.");
      }
      await fetchMessages();
      await fetchUnreadCount();
      setSelected(null);
    } catch (err) {
      console.error("Reply error", err);
    }
  };
 
  const handleDelete = async () => {
    try {
      const headers = getHeaders();
      if (!headers) return;
      await fetch(`${API_BASE}/${deleteMsg.id}`, {
        method: "DELETE",
        headers,
      });
      await fetchMessages();
      await fetchUnreadCount();
      setDeleteMsg(null);
    } catch (err) {
      console.error("Delete error", err);
    }
  };
 
  const matchesDateFilter = (value) => {
    if (dateFilter === "all") return true;
    if (!value) return false;

    const messageDate = new Date(value);
    if (Number.isNaN(messageDate.getTime())) return false;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

    if (dateFilter === "today") {
      return messageDate >= startOfToday && messageDate < startOfTomorrow;
    }

    if (dateFilter === "last7") {
      const startOfRange = new Date(startOfToday);
      startOfRange.setDate(startOfRange.getDate() - 6);
      return messageDate >= startOfRange && messageDate < startOfTomorrow;
    }

    if (dateFilter === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return messageDate >= startOfMonth && messageDate < startOfTomorrow;
    }

    return true;
  };

  const matchesDateRange = (value) => {
    if (!fromDate && !toDate) return true;
    if (!value) return false;

    const messageDate = new Date(value);
    if (Number.isNaN(messageDate.getTime())) return false;

    if (fromDate) {
      const startDate = new Date(`${fromDate}T00:00:00`);
      if (messageDate < startDate) return false;
    }

    if (toDate) {
      const endDate = new Date(`${toDate}T23:59:59.999`);
      if (messageDate > endDate) return false;
    }

    return true;
  };

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase()) ||
      m.subject?.toLowerCase().includes(search.toLowerCase());

    return (
      matchesSearch &&
      matchesDateFilter(m.createdDate) &&
      matchesDateRange(m.createdDate)
    );
  });

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
 
  return (
<div className="messages-wrapper">
<div className="messages-header">
<h1>Contact Messages</h1>
<span className="unread-badge">
          {unreadCount} unread
</span>
</div>
 
      <div className="filter-bar messages-filter-bar">
        <div className="search-box">
<Search size={16} />
<input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
</div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter messages by date"
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="last7">Last 7 Days</option>
          <option value="month">This Month</option>
        </select>
        <label className="messages-date-field">
          <CalendarDays size={15} aria-hidden="true" />
          <span>From</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="Filter messages from date"
          />
        </label>
        <label className="messages-date-field">
          <CalendarDays size={15} aria-hidden="true" />
          <span>To</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate || undefined}
            aria-label="Filter messages to date"
          />
        </label>
      </div>
 
      {loading && <p>Loading...</p>}
 
      <table className="messages-table">
<thead>
<tr>
<th>Sender</th>
<th>Subject</th>
<th>Status</th>
<th>Received</th>
<th>Actions</th>
</tr>
</thead>
 
        <tbody>
          {filtered.map((msg) => (
<tr key={msg.id}>
<td className="message-sender-cell">
<strong title={msg.name}>{msg.name}</strong>
<br />
<small title={msg.email}>{msg.email}</small>
</td>
              <td className="message-subject-cell">
                <span title={msg.subject}>{msg.subject}</span>
              </td>
              <td>
<span className={`status ${normalizeStatus(msg.status) === "unread" ? "unread" : "read"}`}>
                 {normalizeStatus(msg.status) === "unread" ? "Unread" : msg.status || "Read"}
</span>
</td>
              <td>
                <span className="table-date">{formatDate(msg.createdDate)}</span>
</td>
              <td className="table-actions-cell">
                <div className="table-action-group">
<button className="table-icon-btn" onClick={() => openMessage(msg.id)}>
<Eye size={14} />
</button>
                <button className="table-icon-btn table-icon-btn-danger" onClick={() => setDeleteMsg(msg)}>
<Trash2 size={14} />
</button>
                </div>
</td>
</tr>
          ))}
</tbody>
</table>
 
      {selected && (
<div className="modal-overlay">
<div className="modal">
<h3>{selected.subject}</h3>
<p>
              From: {selected.name} ({selected.email})
</p>
            <div className="message-box">
              {selected.message}
</div>
           <div className="modal-actions">
<button onClick={() => setSelected(null)}>
Close
</button>
              <button className="reply-btn" onClick={() => markAsReplied(selected.id)}>
                <CheckCircle2 size={14} />
                Mark Replied
              </button>
</div>
</div>
</div>
      )}
 
      {deleteMsg && (
<div className="modal-overlay">
<div className="modal">
<h3>Delete Message</h3>
<p>Delete message from {deleteMsg.name}?</p>
            <div className="modal-actions">
<button onClick={() => setDeleteMsg(null)}>
                Cancel
</button>
              <button
                className="delete-btn"
                onClick={handleDelete}
>
                Delete
</button>
</div>
</div>
</div>
      )}
</div>
  );
};
 
export default ContactMessages;
