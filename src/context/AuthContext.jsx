import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import apiRequest from "../api/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ============================================
  // USER SESSION
  // ============================================

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("geets-user");
      if (savedUser) {
        return JSON.parse(savedUser);
      }
      return null;
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Check user profile on start if token exists
  useEffect(() => {
    const token = localStorage.getItem("geets-user-token");
    if (token) {
      apiRequest("/users/profile")
        .then((res) => {
          if (res.success && res.user) {
            setUser((prev) => ({ ...prev, ...res.user }));
            localStorage.setItem("geets-user", JSON.stringify(res.user));
          }
        })
        .catch(() => {});
    }
  }, []);

  // ============================================
  // LOGIN
  // ============================================

  const login = async (email, password) => {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanPass = String(password || "").trim();

    // 1. Try Backend API first
    try {
      const res = await apiRequest("/users/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });

      if (res.success && res.user) {
        const userSession = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          addresses: res.user.addresses || [],
          wishlist: res.user.wishlist || [],
        };

        setUser(userSession);
        localStorage.setItem("geets-user", JSON.stringify(userSession));
        if (res.token) {
          localStorage.setItem("geets-user-token", res.token);
        }

        return { success: true };
      }

      if (res.status === 400 || res.status === 401) {
        return {
          success: false,
          message: res.message || "Invalid email or password.",
        };
      }
    } catch (e) {
      console.warn("Backend user login failed, checking local storage fallback:", e);
    }

    // 2. Fallback to local storage
    try {
      const users = JSON.parse(localStorage.getItem("geets-registered-users") || "[]");
      const matchedUser = users.find((u) => u.email === cleanEmail && u.password === cleanPass);

      if (matchedUser) {
        const userSession = {
          name: matchedUser.name,
          email: matchedUser.email,
        };
        setUser(userSession);
        localStorage.setItem("geets-user", JSON.stringify(userSession));
        return { success: true };
      }

      if (cleanEmail === "demo@gmail.com" && cleanPass === "demo123") {
        const demoUser = {
          name: "Glow Customer",
          email: "demo@gmail.com",
        };
        setUser(demoUser);
        localStorage.setItem("geets-user", JSON.stringify(demoUser));
        return { success: true };
      }

      return {
        success: false,
        message: "Invalid email or password.",
      };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong while logging in.",
      };
    }
  };

  // ============================================
  // SIGN UP
  // ============================================

  const signup = async (name, email, password) => {
    const cleanEmail = String(email || "").trim().toLowerCase();
    const cleanName = String(name || "").trim();
    const cleanPass = String(password || "").trim();

    // 1. Try Backend API first
    try {
      const res = await apiRequest("/users/register", {
        method: "POST",
        body: JSON.stringify({ name: cleanName, email: cleanEmail, password: cleanPass }),
      });

      if (res.success && res.user) {
        const userSession = {
          id: res.user.id || res.user._id,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone || "",
          addresses: res.user.addresses || [],
          wishlist: res.user.wishlist || [],
        };

        setUser(userSession);
        localStorage.setItem("geets-user", JSON.stringify(userSession));
        if (res.token) {
          localStorage.setItem("geets-user-token", res.token);
        }

        return { success: true };
      }

      if (res.status === 400) {
        return {
          success: false,
          message: res.message || "Email already registered!",
        };
      }
    } catch (e) {
      console.warn("Backend signup failed, falling back to local storage:", e);
    }

    // 2. Fallback to local storage
    try {
      const users = JSON.parse(localStorage.getItem("geets-registered-users") || "[]");
      const alreadyExists = users.some((u) => u.email === cleanEmail);

      if (alreadyExists) {
        return {
          success: false,
          message: "Email already registered!",
        };
      }

      const newUser = { name: cleanName, email: cleanEmail, password: cleanPass };
      users.push(newUser);
      localStorage.setItem("geets-registered-users", JSON.stringify(users));

      const userSession = { name: cleanName, email: cleanEmail };
      setUser(userSession);
      localStorage.setItem("geets-user", JSON.stringify(userSession));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: "Something went wrong while signing up.",
      };
    }
  };

  // ============================================
  // UPDATE PROFILE
  // ============================================

  const updateProfile = async (profileData) => {
    try {
      const res = await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(profileData),
      });

      if (res.success && res.user) {
        setUser((prev) => ({ ...prev, ...res.user }));
        localStorage.setItem("geets-user", JSON.stringify({ ...user, ...res.user }));
        return { success: true };
      }
    } catch (e) {
      console.warn("Could not sync profile to backend:", e);
    }

    setUser((prev) => ({ ...prev, ...profileData }));
    localStorage.setItem("geets-user", JSON.stringify({ ...user, ...profileData }));
    return { success: true };
  };

  // ============================================
  // LOGOUT
  // ============================================

  const logout = () => {
    setUser(null);
    localStorage.removeItem("geets-user");
    localStorage.removeItem("geets-user-token");
  };

  // ============================================
  // PROVIDER
  // ============================================

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        updateProfile,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// useAuth HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}