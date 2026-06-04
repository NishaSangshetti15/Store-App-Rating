import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios.js";
import { validateLoginForm } from "../utils/validation.js";
import "../styles/Auth.css";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate form
    const validationErrors = validateLoginForm(formData);
    if (validationErrors) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await API.post("/auth/login", formData);
      const { token, role } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      // Navigate based on role
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "owner") {
        navigate("/owner");
      } else {
        navigate("/user");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Please try again.";
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Store Rating App</h1>
        <h2 className="auth-subtitle">Login</h2>
        
        {apiError && <div className="error-message">{apiError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? "input-error" : ""}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <a href="/register">Sign up here</a></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
