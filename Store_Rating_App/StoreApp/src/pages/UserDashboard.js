
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoreList from "../components/StoreList.js";
import { validatePassword } from "../utils/validation.js";
import API from "../api/axios.js";
import "../styles/Dashboard.css";

function UserDashboard() {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "user") {
      navigate("/");
    }
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    const validationError = validatePassword(newPassword);
    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    setLoading(true);
    try {
      await API.put("/users/change-password", { password: newPassword });
      showMessage("Password changed successfully", "success");
      setNewPassword("");
      setShowChangePassword(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to change password";
      showMessage(errorMsg, "error");
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">User Dashboard</h1>
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
                
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}

        <h2 style={{ marginBottom: "20px" }}>Available Stores</h2>
        <StoreList showHeader={true} />
      </div>
    </div>
  );
}

export default UserDashboard;