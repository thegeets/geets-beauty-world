import { createContext, useContext, useState, useEffect } from "react";
import apiRequest from "../api/apiClient";

const AdminAuthContext = createContext(null);

const ADMIN_STORAGE_KEY = "geets-admin-session-v1";
const ADMIN_TOKEN_KEY = "geets-admin-token";

export function AdminAuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (saved && token) {
        return JSON.parse(saved);
      }
      return null;
    } catch (e) {
      console.error("Error reading admin session:", e);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Validate admin token against backend on mount
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      setAdminUser(null);
      setLoading(false);
      return;
    }

    apiRequest("/admin/profile", { useAdminToken: true })
      .then((res) => {
        if (res.success && res.admin) {
          const verifiedSession = {
            id: res.admin.id || res.admin._id,
            name: res.admin.name,
            email: res.admin.email,
            username: res.admin.username,
            role: res.admin.role,
            loggedInAt: new Date().toISOString(),
          };
          setAdminUser(verifiedSession);
          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(verifiedSession));
        } else {
          // Token is invalid or expired
          setAdminUser(null);
          localStorage.removeItem(ADMIN_STORAGE_KEY);
          localStorage.removeItem(ADMIN_TOKEN_KEY);
        }
      })
      .catch(() => {
        // In case of error/unauthorized, invalidate
        setAdminUser(null);
        localStorage.removeItem(ADMIN_STORAGE_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const adminLogin = async (emailOrUsername, password) => {
    const cleanInput = String(emailOrUsername || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();

    if (!cleanInput || !cleanPass) {
      return {
        success: false,
        message: "Please enter your admin email/username and password.",
      };
    }

    try {
      const res = await apiRequest("/admin/login", {
        method: "POST",
        body: JSON.stringify({
          email: cleanInput,
          username: cleanInput,
          password: cleanPass,
        }),
      });

      if (res.success && res.admin && res.token) {
        const session = {
          id: res.admin.id || res.admin._id,
          name: res.admin.name,
          email: res.admin.email,
          username: res.admin.username,
          role: res.admin.role,
          loggedInAt: res.admin.loggedInAt || new Date().toISOString(),
        };

        setAdminUser(session);
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(session));
        localStorage.setItem(ADMIN_TOKEN_KEY, res.token);

        return { success: true };
      }

      return {
        success: false,
        message: res.message || "Invalid admin credentials.",
      };
    } catch (e) {
      console.error("Admin login API error:", e);
      return {
        success: false,
        message: "Server error during admin authentication.",
      };
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch (e) {
      console.error("Error clearing admin session:", e);
    }
  };

  const isAdminAuthenticated = Boolean(adminUser && localStorage.getItem(ADMIN_TOKEN_KEY));

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        isAdminAuthenticated,
        loading,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
