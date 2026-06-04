import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import StoreList from "../components/StoreList.js";
import { validatePassword } from "../utils/validation.js";
import "../styles/Dashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    // Check if user is logged in and is admin
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "admin") {
      navigate("/");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (error) {
      showMessage("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword(newPassword);
    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    setPasswordLoading(true);
    try {
      await API.put("/users/change-password", { password: newPassword });
      showMessage("Password changed successfully", "success");
      setNewPassword("");
      setShowChangePassword(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to change password";
      showMessage(errorMsg, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
        </div>
        <div className="dashboard-content">
          <div className="empty-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={() => setShowChangePassword(true)}>
            Change Password
          </button>
          <button className="btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        {showChangePassword && (
          <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="modal-close" 
                onClick={() => setShowChangePassword(false)}
              >
                ×
              </button>
              <div className="modal-header">Change Password</div>
              
              <form onSubmit={handleChangePassword} className="modal-form">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <small className="field-hint">
                    8-16 characters, must include uppercase letter and special character
                  </small>
                </div>
                
                <button type="submit" className="btn-primary" disabled={passwordLoading}>
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dashboard Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ 
          display: "flex", 
          gap: "10px", 
          marginBottom: "20px",
          borderBottom: "2px solid #e0e0e0",
          paddingBottom: "10px"
        }}>
          <button
            onClick={() => setActiveTab("dashboard")}
            style={{
              padding: "10px 20px",
              background: activeTab === "dashboard" ? "#667eea" : "transparent",
              color: activeTab === "dashboard" ? "white" : "#666",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s"
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab("stores")}
            style={{
              padding: "10px 20px",
              background: activeTab === "stores" ? "#667eea" : "transparent",
              color: activeTab === "stores" ? "white" : "#666",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s"
            }}
          >
            🏪 Stores
          </button>
        </div>

        {/* Stores Tab */}
        {activeTab === "stores" && (
          <div>
            <h2 style={{ marginBottom: "20px" }}>Store Management</h2>
            <StoreList showHeader={true} adminView={true} />
          </div>
        )}

        
      </div>
    </div>
  );
}

export default AdminDashboard;