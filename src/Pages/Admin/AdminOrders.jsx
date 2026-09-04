import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  X,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import { useToast } from "../../context/ToastContext";
import "./AdminDashboard.css";

const STATUS_FILTERS = [
  "All",
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const ORDER_STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

export default function AdminOrders() {
  const { orders, updateOrderStatus, verifyPayment } = useOrders();
  const { addToast } = useToast();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = (orders || []).filter((order) => {
    const matchesStatus =
      selectedStatus === "All" || order.orderStatus === selectedStatus;
    const matchesSearch =
      !search ||
      order.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      order.customer?.phone?.includes(search);
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleVerifyQR = (orderId) => {
    verifyPayment(orderId);
  };

  return (
    <div className="admin-dashboard-container">
      {/* TOOLBAR */}
      <div
        className="admin-card-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          padding: "18px 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#f1f5f9",
              borderRadius: "10px",
              padding: "8px 14px",
              width: "240px",
            }}
          >
            <Search size={16} color="#64748b" />
            <input
              type="text"
              placeholder="Search by ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "13px",
                width: "100%",
                color: "#1e293b",
              }}
            />
          </div>

          {/* Status Tabs */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedStatus(st)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: selectedStatus === st ? "#b85b70" : "#e2e8f0",
                  background: selectedStatus === st ? "#fdeef1" : "#ffffff",
                  color: selectedStatus === st ? "#b85b70" : "#64748b",
                  transition: "all 0.2s ease",
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
          Total: <strong style={{ color: "#0f172a" }}>{filteredOrders.length}</strong> orders
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="admin-card-panel">
        <div className="admin-panel-header">
          <h3>Customer Orders & Fulfillment</h3>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items Ordered</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Fulfillment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No orders found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const statusClass = (order.orderStatus || "Pending").toLowerCase().replace(/\s+/g, "-");
                  const formattedDate = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-NP", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recent";

                  return (
                    <tr key={order.orderId}>
                      <td style={{ fontWeight: 800, color: "#b85b70" }}>
                        {order.orderId}
                      </td>

                      <td style={{ fontSize: "12px", color: "#64748b", whiteSpace: "nowrap" }}>
                        {formattedDate}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700 }}>{order.customer?.fullName || "Customer"}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>
                          {order.customer?.phone} • {order.customer?.city || "Nepal"}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: "12px", maxWidth: "220px" }}>
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                              • {item.name} <span style={{ color: "#64748b" }}>(x{item.quantity})</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: "#0f172a", fontSize: "14px" }}>
                          Rs. {Number(order.total || 0).toLocaleString()}
                        </strong>
                      </td>

                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: "#334155" }}>
                            {order.paymentMethod || "COD"}
                          </span>
                          <span
                            className={`admin-status-pill ${
                              order.paymentStatus === "Verified" ? "delivered" : "pending"
                            }`}
                          >
                            {order.paymentStatus || "Pending"}
                          </span>
                          {order.paymentStatus !== "Verified" && order.paymentMethod?.includes("Online") && (
                            <button
                              type="button"
                              onClick={() => handleVerifyQR(order.orderId)}
                              style={{
                                fontSize: "10px",
                                padding: "2px 6px",
                                borderRadius: "6px",
                                border: "1px solid #10b981",
                                background: "#ecfdf5",
                                color: "#065f46",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Verify QR
                            </button>
                          )}
                        </div>
                      </td>

                      <td>
                        <select
                          value={order.orderStatus || "Pending"}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          style={{
                            padding: "6px 10px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5e1",
                            fontSize: "12px",
                            fontWeight: 700,
                            background: "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          {ORDER_STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => setSelectedOrder(order)}
                          title="View Order Details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "560px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "28px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "14px",
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800 }}>
                  Order #{selectedOrder.orderId}
                </h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Status: <strong style={{ color: "#b85b70" }}>{selectedOrder.orderStatus}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* CUSTOMER INFO */}
            <div
              style={{
                background: "#f8fafc",
                padding: "16px",
                borderRadius: "14px",
                marginBottom: "20px",
              }}
            >
              <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 800, color: "#334155" }}>
                Customer & Shipping Information
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", color: "#475569" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <User size={14} color="#64748b" />
                  <strong>{selectedOrder.customer?.fullName}</strong>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Phone size={14} color="#64748b" />
                  <span>{selectedOrder.customer?.phone}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Mail size={14} color="#64748b" />
                  <span>{selectedOrder.customer?.email}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <MapPin size={14} color="#64748b" />
                  <span>
                    {selectedOrder.customer?.address}, {selectedOrder.customer?.area},{" "}
                    {selectedOrder.customer?.city}, {selectedOrder.customer?.province}
                  </span>
                </div>
              </div>
            </div>

            {/* ITEMS LIST */}
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 800, color: "#334155" }}>
                Items Ordered
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      background: "#f8fafc",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "13px" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: "#64748b" }}>
                        Qty: {item.quantity} × Rs. {Number(item.price).toLocaleString()}
                      </div>
                    </div>
                    <strong style={{ fontSize: "13px" }}>
                      Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTALS */}
            <div
              style={{
                borderTop: "1px solid #e2e8f0",
                paddingTop: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Subtotal</span>
                <span>Rs. {Number(selectedOrder.subtotal || selectedOrder.total).toLocaleString()}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "#16a34a" }}>
                  <span>Discount ({selectedOrder.couponCode || "Coupon"})</span>
                  <span>- Rs. {Number(selectedOrder.discount).toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b" }}>
                <span>Delivery Charge</span>
                <span>
                  {selectedOrder.deliveryCharge === 0 ? "FREE" : `Rs. ${selectedOrder.deliveryCharge}`}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 800,
                  fontSize: "16px",
                  color: "#0f172a",
                  marginTop: "6px",
                  borderTop: "1px dashed #cbd5e1",
                  paddingTop: "8px",
                }}
              >
                <span>Total Amount</span>
                <span style={{ color: "#b85b70" }}>
                  Rs. {Number(selectedOrder.total).toLocaleString()}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="admin-action-btn primary"
                style={{ padding: "8px 20px" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
