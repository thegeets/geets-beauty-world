import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Clock,
  CheckCircle2,
  Truck,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
  Sparkles,
  Printer,
  X,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./Profile.css";

export default function Profile() {
  const { user, logout, updateProfile, addAddress, deleteAddress } = useAuth();
  const { orders } = useOrders();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Address Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [addressProvince, setAddressProvince] = useState("Gandaki");
  const [addressCity, setAddressCity] = useState("Pokhara");
  const [addressArea, setAddressArea] = useState("");
  const [addressStreet, setAddressStreet] = useState("");

  // Profile Edit State
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editPassword, setEditPassword] = useState("");

  if (!user) {
    return (
      <main className="page-container profile-page">
        <div className="profile-empty-state">
          <div className="empty-icon-box">
            <User size={36} />
          </div>
          <h2>Please Sign In</h2>
          <p>You need to be logged in to view your profile and order history.</p>
          <Link to="/" className="primary-btn">
            Go to Homepage
          </Link>
        </div>
      </main>
    );
  }

  // Filter orders for this user (by email or customer name)
  const userOrders = orders.filter(
    (o) =>
      o.customer?.email?.toLowerCase() === user.email?.toLowerCase() ||
      o.customer?.fullName?.toLowerCase() === user.name?.toLowerCase()
  );

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
    });
    addToast("Profile updated successfully! ✨", "success");
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!addressArea.trim() || !addressStreet.trim()) {
      addToast("Please provide both area and street address.", "error");
      return;
    }

    addAddress({
      label: addressLabel,
      province: addressProvince,
      city: addressCity,
      area: addressArea,
      address: addressStreet,
    });

    addToast("New delivery address added!", "success");
    setShowAddressModal(false);
    setAddressArea("");
    setAddressStreet("");
  };

  const handleMoveWishlistToCart = (product) => {
    addToCart(product);
    addToast(`Added "${product.name}" to cart! 🛍️`, "success");
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <span className="order-badge status-delivered"><CheckCircle2 size={13} /> Delivered</span>;
      case "out for delivery":
      case "shipped":
        return <span className="order-badge status-shipped"><Truck size={13} /> Out for Delivery</span>;
      case "confirmed":
      case "processing":
        return <span className="order-badge status-confirmed"><Sparkles size={13} /> Confirmed</span>;
      case "cancelled":
        return <span className="order-badge status-cancelled">Cancelled</span>;
      default:
        return <span className="order-badge status-pending"><Clock size={13} /> Order Placed</span>;
    }
  };

  return (
    <main className="profile-container">
      {/* Profile Header Card */}
      <div className="profile-hero-card">
        <div className="profile-user-info">
          <div className="profile-avatar-large">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div className="profile-meta">
            <div className="profile-title-row">
              <h2>{user.name}</h2>
            </div>
            <p className="profile-email">{user.email}</p>
            {user.phone && <p className="profile-phone">📱 {user.phone}</p>}
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-box">
            <span className="stat-num">{userOrders.length}</span>
            <span className="stat-lbl">Total Orders</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">{wishlist.length}</span>
            <span className="stat-lbl">Wishlist</span>
          </div>
          <div className="stat-box">
            <span className="stat-num">
              Rs. {userOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0).toLocaleString()}
            </span>
            <span className="stat-lbl">Total Spent</span>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar & Content */}
      <div className="profile-body-grid">
        {/* Navigation Sidebar */}
        <aside className="profile-nav-sidebar">
          <button
            type="button"
            className={`profile-nav-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            <Package size={18} />
            <span>My Orders & Tracking</span>
            <span className="nav-badge">{userOrders.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === "wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("wishlist")}
          >
            <Heart size={18} />
            <span>Wishlist</span>
            <span className="nav-badge">{wishlist.length}</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <MapPin size={18} />
            <span>Saved Addresses</span>
          </button>

          <button
            type="button"
            className={`profile-nav-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={18} />
            <span>Account Settings</span>
          </button>

          <button
            type="button"
            className="profile-nav-btn logout-btn"
            onClick={() => {
              logout();
              navigate("/");
              addToast("Logged out successfully", "info");
            }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Tab Content Panel */}
        <div className="profile-tab-content">
          {/* ====================================================
              TAB: ORDERS & TRACKING
             ==================================================== */}
          {activeTab === "orders" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3>Order History & Tracking</h3>
                  <p>Track delivery status and view invoices for past purchases</p>
                </div>
              </div>

              {userOrders.length === 0 ? (
                <div className="pane-empty">
                  <Package size={44} className="empty-svg" />
                  <h4>No Orders Found</h4>
                  <p>You haven't placed any orders yet. Discover our skincare line!</p>
                  <Link to="/shop" className="primary-btn sm">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="orders-list">
                  {userOrders.map((order) => (
                    <div key={order.orderId} className="order-card-premium">
                      <div className="order-card-top">
                        <div className="order-id-group">
                          <span className="order-number">#{order.orderId}</span>
                          <span className="order-date">
                            {new Date(order.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="order-status-group">
                          {getStatusBadge(order.orderStatus)}
                          <button
                            type="button"
                            className="invoice-btn"
                            onClick={() => setSelectedOrderForInvoice(order)}
                          >
                            <Printer size={14} />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>

                      {/* Order Timeline Visualizer */}
                      <div className="order-timeline-tracker">
                        <div
                          className={`track-step ${
                            ["pending", "confirmed", "out for delivery", "shipped", "delivered"].includes(
                              order.orderStatus?.toLowerCase()
                            )
                              ? "completed"
                              : ""
                          }`}
                        >
                          <div className="step-dot" />
                          <span>Order Placed</span>
                        </div>
                        <div
                          className={`track-step ${
                            ["confirmed", "out for delivery", "shipped", "delivered"].includes(
                              order.orderStatus?.toLowerCase()
                            )
                              ? "completed"
                              : ""
                          }`}
                        >
                          <div className="step-dot" />
                          <span>Confirmed</span>
                        </div>
                        <div
                          className={`track-step ${
                            ["out for delivery", "shipped", "delivered"].includes(
                              order.orderStatus?.toLowerCase()
                            )
                              ? "completed"
                              : ""
                          }`}
                        >
                          <div className="step-dot" />
                          <span>Out for Delivery</span>
                        </div>
                        <div
                          className={`track-step ${
                            order.orderStatus?.toLowerCase() === "delivered" ? "completed" : ""
                          }`}
                        >
                          <div className="step-dot" />
                          <span>Delivered</span>
                        </div>
                      </div>

                      {/* Order Products Preview */}
                      <div className="order-items-preview">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="order-item-row">
                            <img
                              src={item.image || "/Hydrating Glow Serum.png"}
                              alt={item.name}
                              className="order-item-img"
                              onError={(e) => {
                                e.target.src = "/Hydrating Glow Serum.png";
                              }}
                            />
                            <div className="order-item-details">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">Qty: {item.quantity}</span>
                            </div>
                            <div className="item-price">
                              Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer summary */}
                      <div className="order-card-footer">
                        <div className="order-payment-info">
                          <span className="payment-type">
                            <CreditCard size={14} /> {order.paymentMethod}
                          </span>
                          <span className="payment-status">({order.paymentStatus})</span>
                        </div>
                        <div className="order-grand-total">
                          <span>Total Paid:</span>
                          <strong>Rs. {Number(order.total).toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              TAB: WISHLIST
             ==================================================== */}
          {activeTab === "wishlist" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3>My Saved Wishlist ({wishlist.length})</h3>
                  <p>Items you love and want to shop later</p>
                </div>
              </div>

              {wishlist.length === 0 ? (
                <div className="pane-empty">
                  <Heart size={44} className="empty-svg" />
                  <h4>Your Wishlist is Empty</h4>
                  <p>Explore our beauty collection and tap the heart icon to save products!</p>
                  <Link to="/shop" className="primary-btn sm">
                    Explore Shop
                  </Link>
                </div>
              ) : (
                <div className="profile-wishlist-grid">
                  {wishlist.map((product) => (
                    <div key={product.id} className="wishlist-item-card">
                      <img
                        src={product.image || "/Hydrating Glow Serum.png"}
                        alt={product.name}
                        className="wishlist-img"
                        onError={(e) => {
                          e.target.src = "/Hydrating Glow Serum.png";
                        }}
                      />
                      <div className="wishlist-info">
                        <span className="wishlist-cat">{product.category}</span>
                        <h4>{product.name}</h4>
                        <div className="wishlist-pricing">
                          <strong>Rs. {Number(product.price).toLocaleString()}</strong>
                          {product.oldPrice && (
                            <span className="old-p">Rs. {Number(product.oldPrice).toLocaleString()}</span>
                          )}
                        </div>
                        <div className="wishlist-actions">
                          <button
                            type="button"
                            className="add-cart-btn"
                            onClick={() => handleMoveWishlistToCart(product)}
                          >
                            <ShoppingBag size={14} />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            type="button"
                            className="remove-wish-btn"
                            onClick={() => removeFromWishlist(product.id)}
                            title="Remove from wishlist"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              TAB: SAVED ADDRESSES
             ==================================================== */}
          {activeTab === "addresses" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3>Delivery Address Book</h3>
                  <p>Manage your shipping destinations for 1-click checkout</p>
                </div>
                <button
                  type="button"
                  className="primary-btn sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  <Plus size={16} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="address-grid">
                {(user.addresses || []).length === 0 ? (
                  <div className="pane-empty">
                    <MapPin size={44} className="empty-svg" />
                    <h4>No Saved Addresses</h4>
                    <p>Add your home or office address for faster checkout.</p>
                  </div>
                ) : (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className="address-card">
                      <div className="address-badge-row">
                        <span className="addr-label">{addr.label || "Home"}</span>
                        {addr.isDefault && <span className="default-pill">Default</span>}
                      </div>
                      <p className="addr-line strong">{user.name}</p>
                      <p className="addr-line">{addr.address}</p>
                      <p className="addr-line">
                        {addr.area}, {addr.city} ({addr.province})
                      </p>
                      <p className="addr-line">📱 {user.phone || "No phone added"}</p>
                      <button
                        type="button"
                        className="delete-addr-btn"
                        onClick={() => {
                          deleteAddress(addr.id);
                          addToast("Address removed", "info");
                        }}
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ====================================================
              TAB: SETTINGS
             ==================================================== */}
          {activeTab === "settings" && (
            <div className="tab-pane">
              <div className="pane-header">
                <div>
                  <h3>Account Settings</h3>
                  <p>Update your personal information and contact details</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address (Cannot change)</label>
                    <input type="email" value={user.email} disabled className="disabled-input" />
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      value="Customer"
                      disabled
                      className="disabled-input"
                    />
                  </div>
                </div>

                <button type="submit" className="primary-btn">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ====================================================
          INVOICE MODAL
         ==================================================== */}
      {selectedOrderForInvoice && (
        <div className="invoice-modal-overlay" onClick={() => setSelectedOrderForInvoice(null)}>
          <div className="invoice-paper" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="close-invoice-btn"
              onClick={() => setSelectedOrderForInvoice(null)}
            >
              <X size={18} />
            </button>

            <div className="invoice-header">
              <div>
                <h2 className="invoice-store-name">GEETS BEAUTY WORLD</h2>
                <p className="invoice-store-sub">Pokhara, Nepal | Care: +977-9846012345</p>
              </div>
              <div className="invoice-meta-right">
                <h3>TAX INVOICE / RECEIPT</h3>
                <p>
                  <strong>Invoice #:</strong> {selectedOrderForInvoice.orderId}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedOrderForInvoice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="invoice-divider" />

            <div className="invoice-client-info">
              <div className="client-col">
                <strong>Billed To:</strong>
                <p>{selectedOrderForInvoice.customer?.fullName || user.name}</p>
                <p>{selectedOrderForInvoice.customer?.phone || user.phone}</p>
                <p>{selectedOrderForInvoice.customer?.email || user.email}</p>
              </div>
              <div className="client-col">
                <strong>Delivery Destination:</strong>
                <p>{selectedOrderForInvoice.customer?.address || "Address on record"}</p>
                <p>
                  {selectedOrderForInvoice.customer?.area},{" "}
                  {selectedOrderForInvoice.customer?.city}
                </p>
                <p>Method: {selectedOrderForInvoice.deliveryMethod || "Standard Delivery"}</p>
              </div>
            </div>

            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th style={{ textAlign: "center" }}>Qty</th>
                  <th style={{ textAlign: "right" }}>Rate</th>
                  <th style={{ textAlign: "right" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrderForInvoice.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td>{it.name}</td>
                    <td style={{ textAlign: "center" }}>{it.quantity}</td>
                    <td style={{ textAlign: "right" }}>Rs. {Number(it.price).toLocaleString()}</td>
                    <td style={{ textAlign: "right" }}>
                      Rs. {(Number(it.price) * Number(it.quantity)).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="invoice-totals">
              <div className="invoice-calc-row">
                <span>Subtotal:</span>
                <span>Rs. {Number(selectedOrderForInvoice.subtotal || 0).toLocaleString()}</span>
              </div>
              {Number(selectedOrderForInvoice.discount) > 0 && (
                <div className="invoice-calc-row discount">
                  <span>Coupon Discount ({selectedOrderForInvoice.couponCode}):</span>
                  <span>- Rs. {Number(selectedOrderForInvoice.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="invoice-calc-row">
                <span>Delivery Fee:</span>
                <span>
                  {Number(selectedOrderForInvoice.deliveryCharge) === 0
                    ? "FREE"
                    : `Rs. ${Number(selectedOrderForInvoice.deliveryCharge).toLocaleString()}`}
                </span>
              </div>
              <div className="invoice-calc-row grand">
                <span>Grand Total:</span>
                <span>Rs. {Number(selectedOrderForInvoice.total).toLocaleString()}</span>
              </div>
            </div>

            <div className="invoice-footer-notes">
              <p>Payment Mode: <strong>{selectedOrderForInvoice.paymentMethod}</strong> ({selectedOrderForInvoice.paymentStatus})</p>
              <p>Thank you for choosing Geets Beauty Products. Stay Glowing!</p>
              <button
                type="button"
                className="print-action-btn"
                onClick={() => window.print()}
              >
                <Printer size={16} /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          ADD ADDRESS MODAL
         ==================================================== */}
      {showAddressModal && (
        <div className="invoice-modal-overlay" onClick={() => setShowAddressModal(false)}>
          <div className="add-addr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h4>Add Delivery Address</h4>
              <button type="button" onClick={() => setShowAddressModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="addr-form">
              <div className="form-group">
                <label>Address Label</label>
                <select value={addressLabel} onChange={(e) => setAddressLabel(e.target.value)}>
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Hostel / Other">Hostel / Other</option>
                </select>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>Province</label>
                  <input
                    type="text"
                    value={addressProvince}
                    onChange={(e) => setAddressProvince(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={addressCity}
                    onChange={(e) => setAddressCity(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Area / Neighborhood</label>
                <input
                  type="text"
                  placeholder="e.g. Lakeside, Street 16"
                  value={addressArea}
                  onChange={(e) => setAddressArea(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Street Address / House No.</label>
                <input
                  type="text"
                  placeholder="e.g. House #24, Near Lake View Point"
                  value={addressStreet}
                  onChange={(e) => setAddressStreet(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="primary-btn full">
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
