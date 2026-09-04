import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container" style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none",
        maxWidth: "380px",
        width: "calc(100% - 48px)"
      }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "14px 18px",
              borderRadius: "14px",
              background: t.type === "error" ? "#dc2626" : t.type === "info" ? "#2563eb" : "#1e293b",
              color: "#ffffff",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.25)",
              fontSize: "14px",
              fontWeight: "500",
              pointerEvents: "auto",
              animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.15)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {t.type === "error" ? (
                <AlertCircle size={18} style={{ color: "#fecaca", flexShrink: 0 }} />
              ) : t.type === "info" ? (
                <Info size={18} style={{ color: "#bfdbfe", flexShrink: 0 }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: "#86efac", flexShrink: 0 }} />
              )}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.7)",
                cursor: "pointer",
                padding: "2px",
                display: "flex",
                alignItems: "center"
              }}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
