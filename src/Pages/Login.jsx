import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, Sparkles, ArrowRight, Facebook } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isSignUp) {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!email.trim() || !password.trim()) {
        setError("Please fill in all fields.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      const res = await signup(name, email, password);
      if (res.success) {
        setSuccess("Account created successfully! Welcome to Geets Beauty.");
        setTimeout(() => navigate("/"), 1200);
      } else {
        setError(res.message);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccess("Logged in successfully! Welcome back.");
      setTimeout(() => navigate("/"), 1200);
    } else {
      setError(res.message);
    }
  };

  const handleFillDemo = () => {
    setEmail("demo@gmail.com");
    setPassword("demo123");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "var(--bg-page, #fdf8f6)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "var(--bg-card, #ffffff)",
          border: "1px solid var(--border-color, rgba(168, 72, 92, 0.16))",
          borderRadius: "28px",
          padding: "40px 32px",
          boxShadow: "0 20px 50px rgba(42, 23, 29, 0.08)",
          boxSizing: "border-box",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "999px",
              background: "var(--primary-light, #fdeef1)",
              color: "var(--primary, #a8485c)",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            <Sparkles size={13} />
            <span>Customer Portal</span>
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "30px",
              fontWeight: 800,
              color: "var(--text-main, #2a171d)",
              margin: "0 0 8px",
            }}
          >
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-muted, #6e565f)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {isSignUp
              ? "Sign up to track orders, save favorites & unlock exclusive beauty offers."
              : "Sign in to track your orders, view wishlist & manage beauty preferences."}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "#ecfdf5",
              border: "1px solid #a7f3d0",
              color: "#065f46",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "18px",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {isSignUp && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginBottom: "6px",
                  color: "var(--text-main, #2a171d)",
                }}
              >
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#988089",
                  }}
                />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    height: "46px",
                    padding: "0 14px 0 44px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color, rgba(168, 72, 92, 0.2))",
                    boxSizing: "border-box",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "6px",
                color: "var(--text-main, #2a171d)",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#988089",
                }}
              />
              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 14px 0 44px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color, rgba(168, 72, 92, 0.2))",
                  boxSizing: "border-box",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 700,
                marginBottom: "6px",
                color: "var(--text-main, #2a171d)",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#988089",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  height: "46px",
                  padding: "0 44px 0 44px",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color, rgba(168, 72, 92, 0.2))",
                  boxSizing: "border-box",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#988089",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isSignUp && (
            <div
              style={{
                background: "var(--primary-light, #fdeef1)",
                borderRadius: "10px",
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "var(--primary, #a8485c)",
              }}
            >
              <span>
                💡 Demo Customer: <strong>demo@gmail.com</strong> / <strong>demo123</strong>
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                style={{
                  background: "var(--primary, #a8485c)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "6px",
                  padding: "3px 8px",
                  fontSize: "10px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Fill
              </button>
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              height: "48px",
              border: "none",
              borderRadius: "999px",
              background: "var(--primary-gradient, linear-gradient(135deg, #a8485c 0%, #8e3547 100%))",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(168, 72, 92, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            <span>{isSignUp ? "Create Customer Account" : "Sign In to Store"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* OR DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "20px 0",
            color: "var(--text-subtle, #988089)",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.8px",
          }}
        >
          <span style={{ flex: 1, height: "1px", background: "var(--border-color, rgba(168, 72, 92, 0.15))" }} />
          <span>OR CONTINUE WITH</span>
          <span style={{ flex: 1, height: "1px", background: "var(--border-color, rgba(168, 72, 92, 0.15))" }} />
        </div>

        {/* SOCIAL LOGINS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <button
            type="button"
            onClick={() => setError("Google login requires OAuth Client ID configuration in production. Please use Email/Password sign in.")}
            style={{
              height: "44px",
              borderRadius: "12px",
              border: "1px solid var(--border-color, rgba(168, 72, 92, 0.18))",
              background: "var(--bg-card, #ffffff)",
              color: "var(--text-main, #2a171d)",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 800, color: "#4285F4" }}>G</span>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => setError("Facebook login requires App ID configuration in production. Please use Email/Password sign in.")}
            style={{
              height: "44px",
              borderRadius: "12px",
              border: "1px solid var(--border-color, rgba(168, 72, 92, 0.18))",
              background: "var(--bg-card, #ffffff)",
              color: "var(--text-main, #2a171d)",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <Facebook size={16} fill="#1877F2" color="#1877F2" />
            <span>Facebook</span>
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: "22px", fontSize: "13px", color: "var(--text-muted, #6e565f)" }}>
          {isSignUp ? "Already have a customer account?" : "New to Geets Beauty?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsSignUp((p) => !p);
              setError("");
              setSuccess("");
            }}
            style={{
              border: "none",
              background: "transparent",
              color: "var(--primary, #a8485c)",
              fontWeight: 800,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
