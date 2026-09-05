
import { useState } from "react";

import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function LoginModal({ isOpen, onClose }) {
  const { login, signup } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  // ==============================
  // RESET FORM
  // ==============================
  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");
    setShowPassword(false);
  };

  // ==============================
  // SWITCH SIGN IN / SIGN UP
  // ==============================
  const switchMode = () => {
    setIsSignUp((prev) => !prev);
    setError("");
    setSuccess("");
    setShowPassword(false);

    // form values clear
    setName("");
    setEmail("");
    setPassword("");
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // SIGN UP
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
        setSuccess(
          "Account created successfully! Welcome to Geets Beauty."
        );

        setTimeout(() => {
          onClose();
          resetForm();
          setIsSignUp(false);
        }, 1500);
      } else {
        setError(res.message);
      }

      return;
    }

    // SIGN IN
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const res = await login(email, password);

    if (res.success) {
      setSuccess("Logged in successfully! Welcome back.");

      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    } else {
      setError(res.message);
    }
  };

  return (
    <>
      {/* =====================================================
          OVERLAY
      ===================================================== */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "rgba(50, 31, 37, 0.65)",
          backdropFilter: "blur(9px)",
          WebkitBackdropFilter: "blur(9px)",
          animation: "geetsFade 0.3s ease",
        }}
      >
        {/* =====================================================
            MAIN MODAL
        ===================================================== */}
        <div
          className="geets-login-card"
          style={{
            position: "relative",
            width: "min(1000px, 95vw)",
            height: "620px",
            maxHeight: "90vh",
            overflow: "hidden",
            borderRadius: "30px",
            background: "#fffaf8",
            boxShadow:
              "0 30px 90px rgba(50,31,37,0.35)",
            animation: "geetsModal 0.45s ease",
          }}
        >
          {/* =================================================
              CLOSE BUTTON
          ================================================= */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              zIndex: 100,
              width: "42px",
              height: "42px",
              border: "none",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.92)",
              color: "#542733",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.12)",
            }}
          >
            <X size={20} />
          </button>

          {/* =================================================
              FORM SIDE
              SIGN IN = LEFT
              SIGN UP = RIGHT
          ================================================= */}
          <div
            className="geets-form-panel"
            style={{
              position: "absolute",
              top: 0,
              left: isSignUp ? "50%" : "0%",
              width: "50%",
              height: "100%",
              zIndex: 30,
              background: "#fffaf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "45px 55px",
              boxSizing: "border-box",
              transition:
                "left 0.7s cubic-bezier(.77,0,.175,1)",
            }}
          >
            <div
              key={isSignUp ? "signup-form" : "signin-form"}
              style={{
                width: "100%",
                maxWidth: "360px",
                animation: isSignUp
                  ? "formFromRight 0.6s ease"
                  : "formFromLeft 0.6s ease",
              }}
            >
              {/* =================================================
                  FORM HEADER
              ================================================= */}
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    color: "#b85b70",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "3px",
                  }}
                >
                  GEETS BEAUTY
                </p>

                <h2
                  style={{
                    margin: "0 0 8px",
                    color: "#321f25",
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                    fontSize: "34px",
                    lineHeight: 1.1,
                    fontWeight: 500,
                  }}
                >
                  {isSignUp
                    ? "Create Account"
                    : "Welcome Back"}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#8a777c",
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {isSignUp
                    ? "Create your account and start your beauty journey."
                    : "Sign in to access your glow account."}
                </p>
              </div>

              {/* =================================================
                  ERROR
              ================================================= */}
              {error && (
                <div
                  style={{
                    marginBottom: "14px",
                    padding: "10px 12px",
                    borderRadius: "9px",
                    background: "#fff1f1",
                    border: "1px solid #f3c3c3",
                    color: "#c62828",
                    fontSize: "12px",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {error}
                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}
              {success && (
                <div
                  style={{
                    marginBottom: "14px",
                    padding: "10px 12px",
                    borderRadius: "9px",
                    background: "#f1faf4",
                    border: "1px solid #ccebd7",
                    color: "#176b42",
                    fontSize: "12px",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  {success}
                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* =================================================
                    FULL NAME — ONLY SIGN UP
                ================================================= */}
                {isSignUp && (
                  <div
                    style={{
                      animation:
                        "fieldAppear 0.4s ease",
                    }}
                  >
                    <label style={labelStyle}>
                      Full Name
                    </label>

                    <div style={inputWrapperStyle}>
                      <User
                        size={18}
                        style={iconStyle}
                      />

                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        required
                        autoComplete="name"
                        style={inputStyle}
                      />
                    </div>
                  </div>
                )}

                {/* =================================================
                    EMAIL
                ================================================= */}
                <div>
                  <label style={labelStyle}>
                    Email Address
                  </label>

                  <div style={inputWrapperStyle}>
                    <Mail
                      size={18}
                      style={iconStyle}
                    />

                    <input
                      type="email"
                      placeholder="example@gmail.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                      autoComplete="email"
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}
                <div>
                  <label style={labelStyle}>
                    Password
                  </label>

                  <div style={inputWrapperStyle}>
                    <Lock
                      size={18}
                      style={iconStyle}
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete={
                        isSignUp
                          ? "new-password"
                          : "current-password"
                      }
                      style={{
                        ...inputStyle,
                        paddingRight: "45px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform:
                          "translateY(-50%)",
                        border: "none",
                        background:
                          "transparent",
                        color: "#9a858b",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* =================================================
                    DEMO LOGIN
                ================================================= */}
                {!isSignUp && (
                  <div
                    style={{
                      padding: "8px 10px",
                      borderRadius: "8px",
                      background: "#fcecef",
                      color: "#8b4355",
                      fontSize: "10px",
                      textAlign: "center",
                    }}
                  >
                    💡 Quick Demo:{" "}
                    <strong>
                      demo@gmail.com
                    </strong>{" "}
                    /{" "}
                    <strong>demo123</strong>
                  </div>
                )}

                {/* =================================================
                    SUBMIT BUTTON
                ================================================= */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    height: "47px",
                    marginTop: "3px",
                    border: "none",
                    borderRadius: "25px",
                    background:
                      "linear-gradient(135deg, #8b4355, #b85b70)",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow:
                      "0 8px 20px rgba(139,67,85,0.22)",
                  }}
                >
                  {isSignUp
                    ? "Create Account"
                    : "Sign In"}
                </button>
              </form>

              {/* =================================================
                  BOTTOM SWITCH
              ================================================= */}
              <div
                style={{
                  marginTop: "18px",
                  textAlign: "center",
                  color: "#8a777c",
                  fontSize: "12px",
                }}
              >
                {isSignUp
                  ? "Already have an account?"
                  : "New to Geets Beauty?"}

                <button
                  type="button"
                  onClick={switchMode}
                  style={{
                    marginLeft: "5px",
                    border: "none",
                    background: "transparent",
                    color: "#8b4355",
                    fontWeight: 800,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {isSignUp
                    ? "Sign In"
                    : "Sign Up"}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              WELCOME / ANIMATED PANEL
              SIGN IN = RIGHT
              SIGN UP = LEFT
          ===================================================== */}
          <div
            className="geets-welcome-panel"
            style={{
              position: "absolute",
              top: 0,
              left: isSignUp
                ? "0%"
                : "50%",
              width: "50%",
              height: "100%",
              zIndex: 40,
              background:
                "linear-gradient(145deg, #542733, #8b4355 55%, #b85b70)",
              clipPath: isSignUp
                ? "polygon(0 0, 88% 0, 100% 100%, 0 100%)"
                : "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
              transition:
                "left 0.7s cubic-bezier(.77,0,.175,1), clip-path 0.7s cubic-bezier(.77,0,.175,1)",
              overflow: "hidden",
            }}
          >
            {/* =================================================
                DECORATION CIRCLE 1
            ================================================= */}
            <div
              style={{
                position: "absolute",
                width: "350px",
                height: "350px",
                borderRadius: "50%",
                border:
                  "1px solid rgba(255,255,255,0.13)",
                top: "-130px",
                right: "-120px",
              }}
            />

            {/* =================================================
                DECORATION CIRCLE 2
            ================================================= */}
            <div
              style={{
                position: "absolute",
                width: "230px",
                height: "230px",
                borderRadius: "50%",
                border:
                  "1px solid rgba(255,255,255,0.1)",
                bottom: "-90px",
                left: "-80px",
              }}
            />

            {/* =================================================
                WELCOME CONTENT
            ================================================= */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "50px",
                boxSizing: "border-box",
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              <div
                key={
                  isSignUp
                    ? "welcome-signup"
                    : "welcome-signin"
                }
                style={{
                  width: "100%",
                  maxWidth: "310px",
                  animation:
                    "panelText 0.65s ease",
                }}
              >
                {/* FLOWER */}
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    margin:
                      "0 auto 22px",
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(255,255,255,0.45)",
                    background:
                      "rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "29px",
                  }}
                >
                  ✿
                </div>

                {/* BRAND */}
                <p
                  style={{
                    margin: "0 0 10px",
                    color: "#f8dce2",
                    fontSize: "10px",
                    fontWeight: 800,
                    letterSpacing: "3px",
                  }}
                >
                  GEETS BEAUTY
                </p>

                {/* TITLE */}
                <h2
                  style={{
                    margin: "0 0 17px",
                    fontFamily:
                      'Georgia, "Times New Roman", serif',
                    fontSize: "40px",
                    lineHeight: 1.08,
                    fontWeight: 500,
                    color: "#ffffff",
                  }}
                >
                  Hello, Beauty!
                </h2>

                {/* DESCRIPTION */}
                <p
                  style={{
                    margin: 0,
                    color: "#f8e8eb",
                    fontSize: "13px",
                    lineHeight: 1.8,
                  }}
                >
                  {isSignUp
                    ? "Already have an account? Sign in and continue your beautiful journey."
                    : "New to Geets Beauty? Create an account and discover your everyday glow."}
                </p>

                {/* PANEL BUTTON */}
                <button
                  type="button"
                  onClick={switchMode}
                  style={{
                    marginTop: "28px",
                    padding:
                      "12px 32px",
                    border:
                      "1px solid rgba(255,255,255,0.75)",
                    borderRadius: "25px",
                    background:
                      "transparent",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 800,
                    cursor: "pointer",
                    letterSpacing:
                      "0.8px",
                  }}
                >
                  {isSignUp
                    ? "SIGN IN"
                    : "SIGN UP"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS + RESPONSIVE
      ===================================================== */}
      <style>
        {`
          @keyframes geetsFade {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes geetsModal {
            from {
              opacity: 0;
              transform: scale(0.94) translateY(15px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          @keyframes formFromLeft {
            from {
              opacity: 0;
              transform: translateX(-25px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes formFromRight {
            from {
              opacity: 0;
              transform: translateX(25px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes panelText {
            from {
              opacity: 0;
              transform: translateX(25px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fieldAppear {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @media (max-width: 750px) {
            .geets-login-card {
              width: min(480px, 94vw) !important;
              height: auto !important;
              max-height: 92vh !important;
              overflow-y: auto !important;
              border-radius: 24px !important;
            }

            .geets-welcome-panel {
              display: none !important;
            }

            .geets-form-panel {
              position: relative !important;
              width: 100% !important;
              left: 0 !important;
              top: 0 !important;
              height: auto !important;
              padding: 36px 28px !important;
            }
          }

          @media (max-width: 480px) {
            .geets-login-card {
              width: 95vw !important;
              max-height: 94vh !important;
              border-radius: 20px !important;
            }

            .geets-form-panel {
              padding: 30px 18px !important;
            }
          }

          @media (max-width: 360px) {
            .geets-form-panel {
              padding: 26px 14px !important;
            }
          }
        `}
      </style>
    </>
  );
}

/* =====================================================
   INLINE STYLES
===================================================== */

const labelStyle = {
  display: "block",
  marginBottom: "6px",
  color: "#542733",
  fontSize: "12px",
  fontWeight: 700,
};

const inputWrapperStyle = {
  position: "relative",
  width: "100%",
};

const iconStyle = {
  position: "absolute",
  left: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#a48c92",
  pointerEvents: "none",
};

const inputStyle = {
  width: "100%",
  height: "46px",
  boxSizing: "border-box",
  padding: "0 14px 0 43px",
  border: "1px solid #ead5d9",
  borderRadius: "11px",
  outline: "none",
  background: "#ffffff",
  color: "#321f25",
  fontSize: "12px",
};

