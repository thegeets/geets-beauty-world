import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { useOrders } from "../../context/OrderContext";
import "./AdminLayout.css";

export default function AdminLayout() {
  const { adminUser, adminLogout } = useAdminAuth();
  const { orders } = useOrders();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = (orders || []).filter(
    (o) => o.orderStatus === "Pending"
  ).length;

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/products")) return "Product Management";
    if (path.includes("/admin/orders")) return "Orders & Fulfillment";
    if (path.includes("/admin/customers")) return "Customer Profiles";
    if (path.includes("/admin/reviews")) return "Reviews & Ratings";
    return "Dashboard Overview";
  };

  return (
    <div className="admin-layout-root">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Link to="/admin/dashboard" className="admin-sidebar-brand">
          <div className="admin-brand-icon-wrap">
            <Sparkles size={20} />
          </div>
          <div className="admin-brand-text">
            <h3>Geets Beauty</h3>
            <span>Admin Suite</span>
          </div>
        </Link>

        <ul className="admin-nav-list">
          <li>
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <Package size={18} />
              <span>Products</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingBag size={18} />
              <span>Orders</span>
              {pendingOrdersCount > 0 && (
                <span className="admin-nav-badge">{pendingOrdersCount}</span>
              )}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <Users size={18} />
              <span>Customers</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
              onClick={() => setMobileMenuOpen(false)}
            >
              <Star size={18} />
              <span>Reviews</span>
            </NavLink>
          </li>
        </ul>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info-box">
            <div className="admin-user-avatar">
              {adminUser?.name?.[0] || "A"}
            </div>
            <div className="admin-user-details">
              <div className="admin-user-name">{adminUser?.name || "Admin"}</div>
              <div className="admin-user-role">{adminUser?.role || "Administrator"}</div>
            </div>
          </div>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Body */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              type="button"
              className="admin-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className="admin-topbar-page-title">{getPageTitle()}</h2>
          </div>

          <div className="admin-topbar-right">
            <Link to="/" className="admin-visit-store-btn" target="_blank" rel="noopener noreferrer">
              <span>View Customer Store</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </header>

        <main className="admin-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
