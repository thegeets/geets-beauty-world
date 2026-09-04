import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrderContext";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useOrders();

  const totalProducts = products?.length || 0;
  const totalOrders = orders?.length || 0;
  const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const pendingOrders = (orders || []).filter((o) => o.orderStatus === "Pending").length;
  const deliveredOrders = (orders || []).filter((o) => o.orderStatus === "Delivered").length;

  const mockCustomersCount = 14 + totalOrders;
  const mockReviewsCount = 28;

  const recentOrders = (orders || []).slice(0, 5);

  return (
    <div className="admin-dashboard-container">
      {/* 4 SUMMARY STATS */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span>Total Revenue</span>
            <h3>Rs. {totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="admin-stat-icon-wrap green">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span>Total Orders</span>
            <h3>{totalOrders}</h3>
          </div>
          <div className="admin-stat-icon-wrap pink">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span>Active Products</span>
            <h3>{totalProducts}</h3>
          </div>
          <div className="admin-stat-icon-wrap blue">
            <Package size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-info">
            <span>Total Customers</span>
            <h3>{mockCustomersCount}</h3>
          </div>
          <div className="admin-stat-icon-wrap amber">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* QUICK STATUS STRIP */}
      <div className="admin-card-panel" style={{ padding: "18px 24px" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
              Pending Fulfillment: <strong style={{ color: "#0f172a" }}>{pendingOrders}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
              Delivered Successfully: <strong style={{ color: "#0f172a" }}>{deliveredOrders}</strong>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#b85b70" }} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
              Customer Reviews: <strong style={{ color: "#0f172a" }}>{mockReviewsCount}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="admin-card-panel">
        <div className="admin-panel-header">
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" className="admin-view-all-link">
            <span>View All Orders</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const statusClass = (order.orderStatus || "Pending").toLowerCase().replace(/\s+/g, "-");
                  return (
                    <tr key={order.orderId}>
                      <td style={{ fontWeight: 700, color: "#b85b70" }}>
                        {order.orderId}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customer?.fullName || "Guest Customer"}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{order.customer?.phone || ""}</div>
                      </td>
                      <td>{order.items?.length || 1} product(s)</td>
                      <td style={{ fontWeight: 700 }}>
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </td>
                      <td>
                        <span style={{ fontSize: "12px", color: "#475569" }}>
                          {order.paymentMethod || "COD"}
                        </span>
                      </td>
                      <td>
                        <span className={`admin-status-pill ${statusClass}`}>
                          {order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td>
                        <Link to="/admin/orders" className="admin-action-btn">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
