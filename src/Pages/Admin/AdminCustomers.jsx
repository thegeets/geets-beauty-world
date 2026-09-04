import { useState, useMemo, useEffect } from "react";
import { Search, User, Mail, Phone, ShoppingBag, ShieldCheck } from "lucide-react";
import { useOrders } from "../../context/OrderContext";
import apiRequest from "../../api/apiClient";
import "./AdminDashboard.css";

const MOCK_REGISTERED_DEFAULTS = [
  {
    name: "Glow Customer",
    email: "demo@gmail.com",
    phone: "9812345678",
    city: "Kathmandu",
    status: "Demo Active",
    joinedAt: "2025-01-10",
  },
  {
    name: "Anjali Shrestha",
    email: "anjali.s@gmail.com",
    phone: "9841234567",
    city: "Pokhara",
    status: "VIP Customer",
    joinedAt: "2025-01-15",
  },
  {
    name: "Pooja Gurung",
    email: "pooja.g@hotmail.com",
    phone: "9806543210",
    city: "Pokhara",
    status: "Active",
    joinedAt: "2025-02-01",
  },
  {
    name: "Sunita Adhikari",
    email: "sunita.adhikari@gmail.com",
    phone: "9856012345",
    city: "Lalitpur",
    status: "Active",
    joinedAt: "2025-02-14",
  },
];

export default function AdminCustomers() {
  const { orders } = useOrders();
  const [search, setSearch] = useState("");
  const [backendCustomers, setBackendCustomers] = useState([]);

  useEffect(() => {
    apiRequest("/admin/customers", { useAdminToken: true })
      .then((res) => {
        if (res.success && Array.isArray(res.customers)) {
          setBackendCustomers(res.customers);
        }
      })
      .catch(() => {});
  }, []);

  const customersList = useMemo(() => {
    let registered = [];
    try {
      registered = JSON.parse(
        localStorage.getItem("geets-registered-users") || "[]"
      );
    } catch {
      registered = [];
    }

    const map = new Map();

    MOCK_REGISTERED_DEFAULTS.forEach((cust) => {
      map.set(cust.email.toLowerCase(), {
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        city: cust.city,
        status: cust.status,
        joinedAt: cust.joinedAt,
        ordersCount: 0,
        totalSpent: 0,
      });
    });

    // Incorporate backend customers
    backendCustomers.forEach((bc) => {
      if (bc.email) {
        const key = bc.email.toLowerCase();
        map.set(key, {
          name: bc.name,
          email: bc.email,
          phone: bc.phone || "—",
          city: bc.city || "Nepal",
          status: bc.email === "demo@gmail.com" ? "Demo Active" : "Active Customer",
          joinedAt: bc.joinedAt ? String(bc.joinedAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
          ordersCount: bc.ordersCount || 0,
          totalSpent: bc.totalSpent || 0,
        });
      }
    });

    registered.forEach((u) => {
      if (u.email) {
        const key = u.email.toLowerCase();
        if (!map.has(key)) {
          map.set(key, {
            name: u.name || "Customer",
            email: u.email,
            phone: u.phone || "—",
            city: "Nepal",
            status: "Registered",
            joinedAt: new Date().toISOString().slice(0, 10),
            ordersCount: 0,
            totalSpent: 0,
          });
        }
      }
    });

    // Count orders from useOrders()
    (orders || []).forEach((order) => {
      const emailKey = order.customer?.email?.toLowerCase();
      if (emailKey && map.has(emailKey)) {
        const existing = map.get(emailKey);
        existing.ordersCount += 1;
        existing.totalSpent += Number(order.total) || 0;
        if (order.customer?.phone) existing.phone = order.customer.phone;
        if (order.customer?.city) existing.city = order.customer.city;
      } else if (emailKey) {
        map.set(emailKey, {
          name: order.customer?.fullName || "Guest Customer",
          email: order.customer.email,
          phone: order.customer?.phone || "—",
          city: order.customer?.city || "Nepal",
          status: "Guest Buyer",
          joinedAt: order.createdAt ? order.createdAt.slice(0, 10) : "2025-02-01",
          ordersCount: 1,
          totalSpent: Number(order.total) || 0,
        });
      }
    });

    return Array.from(map.values());
  }, [orders]);

  const filtered = customersList.filter((c) => {
    return (
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search) ||
      c.city?.toLowerCase().includes(search.toLowerCase())
    );
  });

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#f1f5f9",
            borderRadius: "10px",
            padding: "8px 14px",
            width: "280px",
          }}
        >
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Search customers by name/email..."
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

        <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b" }}>
          Registered Customers: <strong style={{ color: "#0f172a" }}>{filtered.length}</strong>
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="admin-card-panel">
        <div className="admin-panel-header">
          <h3>Customer Directory & Lifetime Value</h3>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact Email</th>
                <th>Phone Number</th>
                <th>City</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No customer records match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((customer, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "50%",
                            background: "#fdeef1",
                            color: "#b85b70",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: "13px",
                          }}
                        >
                          {customer.name[0] || "U"}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{customer.name}</div>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
                            Joined {customer.joinedAt}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: "12px", color: "#475569" }}>{customer.email}</span>
                    </td>

                    <td>
                      <span style={{ fontSize: "12px", color: "#475569" }}>{customer.phone}</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 600 }}>{customer.city}</span>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>
                        {customer.ordersCount} order(s)
                      </span>
                    </td>

                    <td>
                      <strong style={{ color: "#b85b70" }}>
                        Rs. {customer.totalSpent.toLocaleString()}
                      </strong>
                    </td>

                    <td>
                      <span
                        className="admin-status-pill approved"
                        style={{
                          background: customer.status.includes("VIP")
                            ? "#fef3c7"
                            : customer.status.includes("Demo")
                            ? "#e0f2fe"
                            : "#dcfce7",
                          color: customer.status.includes("VIP")
                            ? "#92400e"
                            : customer.status.includes("Demo")
                            ? "#0369a1"
                            : "#15803d",
                        }}
                      >
                        {customer.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
