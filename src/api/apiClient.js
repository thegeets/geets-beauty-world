// API Base URL with Vite environment variable support and fallback defaults:
// - Vercel / Production build defaults to Render backend: https://geets-beauty-world.onrender.com/api
// - Local development (npm run dev) defaults to: http://localhost:5000/api
// - Can be explicitly overridden with VITE_API_URL environment variable
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }
  return import.meta.env.PROD
    ? "https://geets-beauty-world.onrender.com/api"
    : "http://localhost:5000/api";
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Generic API fetch helper with JSON parsing & error extraction
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Attach customer token if available
  const userToken = localStorage.getItem("geets-user-token");
  const adminToken = localStorage.getItem("geets-admin-token");

  if (options.useAdminToken && adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  } else if (userToken && !headers["Authorization"]) {
    headers["Authorization"] = `Bearer ${userToken}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        message: data.message || `Request failed with status ${response.status}`,
        data,
      };
    }

    return {
      success: true,
      status: response.status,
      ...data,
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error.message || "Network error. Backend server may be offline.",
      isNetworkError: true,
    };
  }
}

export default apiRequest;
