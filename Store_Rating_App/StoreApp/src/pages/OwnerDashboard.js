import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { validatePassword } from "../utils/validation.js";
import "../styles/Dashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Check if user is logged in and is store owner
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "owner") {
      navigate("/");
      return;
    }

    loadStoresData();
  }, [navigate]);

  const loadStoresData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/stores");
      // For store owners, they would see only their stores
      // This would require a backend endpoint that filters by owner
      setStores(res.data);
    } catch (error) {
      showMessage("Failed to load store data", "error");
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
          <h1 className="dashboard-title">Store Owner Dashboard</h1>
        </div>
        <div className="dashboard-content">
          <div className="empty-state">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  // Calculate average rating across all stores (in a real app, this would be filtered by owner)
  const calculateAverageRating = () => {
    if (stores.length === 0) return 0;
    const totalRating = stores.reduce((sum, store) => sum + (parseFloat(store.avg_rating) || 0), 0);
    return (totalRating / stores.length).toFixed(1);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Store Owner Dashboard</h1>
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

        {/* Store Statistics */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-label">Your Stores</div>
            <div className="stat-value">{stores.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average Rating</div>
            <div className="stat-value">
              {calculateAverageRating() > 0 ? `${calculateAverageRating()}⭐` : "N/A"}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">
              {stores.reduce((sum, store) => {
                // This would need actual rating count from backend
                return sum + 0;
              }, 0)}
            </div>
          </div>
        </div>

        {/* Store List */}
        <div className="table-section">
          <div className="table-header">
            <h3 className="table-title">Your Stores</h3>
          </div>
          
          <div className="table-content">
            {stores.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏪</div>
                <p>No stores assigned to you yet</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.email || "-"}</td>
                      <td>{store.address || "-"}</td>
                      <td>
                        {store.avg_rating ? (
                          <>
                            {parseFloat(store.avg_rating).toFixed(1)}⭐ / 5
                          </>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;