const API_BASE_URL = "http://localhost:5000/api";

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
