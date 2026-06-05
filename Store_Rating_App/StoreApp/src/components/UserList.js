import React, { useEffect, useState } from "react";
import API from "../api/axios.js";

function UserList({ showHeader = false, adminView = false, onUserCreated }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", address: "", role: "user" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users");
      setUsers(res.data.users || []);
    } catch (error) {
      setMessage("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/users", form);
      setMessage("User created successfully");
      setForm({ name: "", email: "", password: "", address: "", role: "user" });
      loadUsers();
      if (typeof onUserCreated === "function") {
        onUserCreated();
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create user";
      setMessage(msg);
    }
  };

  return (
    <div>
      {showHeader && <h3>User Management</h3>}

      {message && <div style={{ marginBottom: 10 }}>{message}</div>}

      {adminView && (
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
            <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required />
            <input name="address" value={form.address} onChange={handleChange} placeholder="Address" />
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="owner">Store Owner</option>
            </select>
            <button type="submit">Add</button>
          </div>
        </form>
      )}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>ID</th>
              <th style={{ textAlign: "left", padding: 8 }}>Name</th>
              <th style={{ textAlign: "left", padding: 8 }}>Email</th>
              <th style={{ textAlign: "left", padding: 8 }}>Address</th>
              <th style={{ textAlign: "left", padding: 8 }}>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: 8 }}>{u.id}</td>
                <td style={{ padding: 8 }}>{u.name}</td>
                <td style={{ padding: 8 }}>{u.email}</td>
                <td style={{ padding: 8 }}>{u.address}</td>
                <td style={{ padding: 8 }}>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
