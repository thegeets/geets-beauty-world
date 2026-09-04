import { Navigate, Outlet } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminProtectedRoute() {
  const { isAdminAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0c10", color: "#94a3b8", fontFamily: "sans-serif" }}>
        Verifying administrator session...
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
