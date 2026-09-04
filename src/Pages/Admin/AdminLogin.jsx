import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { adminLogin } = useAdminAuth();
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await adminLogin(emailOrUsername, password);
      if (res.success) {
        navigate("/admin/dashboard");
      } else {
        setError(res.message || "Invalid admin email or password.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg-glow-1" />
      <div className="admin-login-bg-glow-2" />

      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-badge-tag">
            <ShieldCheck size={14} />
            <span>Admin Portal</span>
          </div>

          <h1 className="admin-login-title">Geets Beauty World</h1>
          <p className="admin-login-subtitle">
            Administrative Management & Store Control Center
          </p>
        </div>

        {error && (
          <div className="admin-login-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field-group">
            <label className="admin-field-label">Admin Email or Username</label>
            <div className="admin-input-wrapper">
              <Mail size={18} className="admin-input-icon" />
              <input
                type="text"
                className="admin-input-control"
                placeholder="Enter your admin email or username"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="admin-field-group">
            <label className="admin-field-label">Admin Password</label>
            <div className="admin-input-wrapper">
              <Lock size={18} className="admin-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                className="admin-input-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="admin-pass-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <Link to="/" className="admin-back-store-link">
            <ArrowLeft size={14} />
            <span>Back to Customer Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
