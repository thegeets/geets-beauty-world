import { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrderContext.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { Tag, CheckCircle2, MapPin } from "lucide-react";

export default function Checkout() {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const { validateCoupon } = useOrders();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    province: defaultAddr?.province || "",
    city: defaultAddr?.city || "",
    area: defaultAddr?.area || "",
    address: defaultAddr?.address || "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState("home");

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // LOGIN CHECK
  if (!user) {
    return (
      <main className="page-container checkout-page">
        <div className="checkout-login">
          <p className="eyebrow">Almost there</p>
          <h1>Login to continue</h1>
          <p>Please login or create an account before entering your delivery details.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Go to Store / Login
          </button>
        </div>
      </main>
    );
  }

  // EMPTY CART CHECK
  if (cart.length === 0) {
    return (
      <main className="page-container checkout-page">
        <div className="checkout-login">
          <h1>Your cart is empty</h1>
          <p>Add products to your cart before checkout.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/shop")}
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleApplySavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      province: addr.province,
      city: addr.city,
      area: addr.area,
      address: addr.address,
    }));
    addToast(`Selected "${addr.label || "Saved"}" address!`, "info");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = validateCoupon(couponInput, cartTotal);
    if (res.valid) {
      setAppliedCoupon(res.coupon);
      setDiscountAmount(res.discountAmount);
      addToast(res.message, "success");
    } else {
      addToast(res.message, "error");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput("");
    addToast("Coupon removed", "info");
  };

  // DELIVERY CHARGE
  const isPokhara = formData.city.trim().toLowerCase().includes("pokhara");

  let deliveryCharge = 150;
  if (isPokhara) {
    deliveryCharge = 0;
  } else if (deliveryMethod === "courier") {
    deliveryCharge = 100;
  }

  const discountedSubtotal = Math.max(0, cartTotal - discountAmount);
  const finalTotal = discountedSubtotal + deliveryCharge;

  // CONTINUE TO PAYMENT
  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.province ||
      !formData.city.trim() ||
      !formData.area.trim() ||
      !formData.address.trim()
    ) {
      addToast("Please fill all delivery details.", "error");
      return;
    }

    if (!formData.email.includes("@")) {
      addToast("Please enter a valid email address.", "error");
      return;
    }

    if (formData.phone.length < 10) {
      addToast("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    const orderData = {
      orderId: `GBW-${Date.now().toString().slice(-8)}`,
      customer: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        province: formData.province,
        city: formData.city,
        area: formData.area,
        address: formData.address,
      },
      deliveryMethod,
      deliveryCharge,
      subtotal: cartTotal,
      discount: discountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      total: finalTotal,
      items: cart,
      createdAt: new Date().toISOString(),
    };

    // Save order temporarily
    localStorage.setItem("geets-pending-order", JSON.stringify(orderData));

    // Go to payment page
    navigate("/payment");
  };

  return (
    <main className="page-container checkout-page">
      {/* PAGE HEADER */}
      <div className="page-heading left-heading">
        <p className="eyebrow">Geets Beauty World</p>
        <h1>Checkout</h1>
        <p>Enter your delivery details to complete your order.</p>
      </div>

      <div className="checkout-layout">
        {/* LEFT SIDE FORM */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          {/* SAVED ADDRESS SHORTCUTS */}
          {user?.addresses && user.addresses.length > 0 && (
            <section className="checkout-section" style={{ background: "#fdf2f4", border: "1px dashed #fecdd3" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <MapPin size={16} color="#bd6975" />
                <h3 style={{ margin: 0, fontSize: "14px", color: "#881337", fontWeight: "700" }}>
                  Quick Fill from Saved Addresses
                </h3>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {user.addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => handleApplySavedAddress(addr)}
                    style={{
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "10px",
                      padding: "6px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#334155",
                      cursor: "pointer",
                    }}
                  >
                    📍 {addr.label} ({addr.city})
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* DELIVERY ADDRESS */}
          <section className="checkout-section">
            <h2>Delivery Address</h2>

            {/* FULL NAME */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* EMAIL */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
              <small>Order invoice and tracking confirmation will be sent here.</small>
            </div>

            {/* PHONE */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="98XXXXXXXX"
                required
              />
            </div>

            {/* PROVINCE */}
            <div className="form-group">
              <label htmlFor="province">Province</label>
              <select
                id="province"
                name="province"
                value={formData.province}
                onChange={handleChange}
                required
              >
                <option value="">Select Province</option>
                <option value="Koshi">Koshi</option>
                <option value="Madhesh">Madhesh</option>
                <option value="Bagmati">Bagmati</option>
                <option value="Gandaki">Gandaki</option>
                <option value="Lumbini">Lumbini</option>
                <option value="Karnali">Karnali</option>
                <option value="Sudurpashchim">Sudurpashchim</option>
              </select>
            </div>

            {/* CITY */}
            <div className="form-group">
              <label htmlFor="city">City / District</label>
              <input
                id="city"
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Pokhara or Kathmandu"
                required
              />
            </div>

            {/* AREA */}
            <div className="form-group">
              <label htmlFor="area">Area / Locality</label>
              <input
                id="area"
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Lakeside, Street 16"
                required
              />
            </div>

            {/* STREET ADDRESS */}
            <div className="form-group">
              <label htmlFor="address">Exact Street Address / Landmark</label>
              <input
                id="address"
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. House No. 24, Near Lake Point"
                required
              />
            </div>
          </section>

          {/* DELIVERY METHOD */}
          <section className="checkout-section">
            <h2>Delivery Method</h2>

            {/* HOME DELIVERY */}
            <label className="payment-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="home"
                checked={deliveryMethod === "home"}
                onChange={(event) => setDeliveryMethod(event.target.value)}
              />
              <div>
                <strong>🏠 Home Delivery</strong>
                <p>{isPokhara ? "Pokhara Valley: FREE Delivery" : "Outside Pokhara: Rs. 150"}</p>
              </div>
            </label>

            {/* COURIER */}
            <label className="payment-option">
              <input
                type="radio"
                name="deliveryMethod"
                value="courier"
                checked={deliveryMethod === "courier"}
                onChange={(event) => setDeliveryMethod(event.target.value)}
              />
              <div>
                <strong>📦 Courier Branch Pickup / Delivery</strong>
                <p>Rs. 100</p>
              </div>
            </label>

            <p className="delivery-note">
              {isPokhara
                ? "🎉 Free delivery applied for Pokhara Valley."
                : "Standard delivery outside Pokhara: Rs. 150. Courier delivery: Rs. 100."}
            </p>
          </section>

          {/* CONTINUE BUTTON */}
          <button type="submit" className="primary-button full-width">
            Continue to Payment
          </button>
        </form>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <aside className="cart-summary checkout-summary">
          <h2>Order Summary</h2>

          {/* PRODUCTS */}
          {cart.map((item) => (
            <div className="summary-product" key={item.id}>
              <span>
                {item.name} × {item.quantity}
              </span>
              <strong>
                Rs. {(Number(item.price) * Number(item.quantity)).toLocaleString()}
              </strong>
            </div>
          ))}

          <hr />

          {/* COUPON CODE FORM */}
          <div style={{ margin: "16px 0" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "700",
                color: "#475569",
                marginBottom: "6px",
              }}
            >
              Have a Promo Code?
            </label>
            {!appliedCoupon ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="e.g. GLOW20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cbd5e1",
                    fontSize: "13px",
                    fontWeight: "600",
                    letterSpacing: "0.5px",
                  }}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  style={{
                    background: "#1e293b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Apply
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  padding: "8px 12px",
                  borderRadius: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} color="#16a34a" />
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "#15803d" }}>
                    {appliedCoupon.code} Applied
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#dc2626",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            )}
            <small style={{ display: "block", color: "#94a3b8", fontSize: "11px", marginTop: "4px" }}>
              Try <strong>GLOW20</strong> for 20% OFF or <strong>GEETS10</strong> for 10% OFF.
            </small>
          </div>

          <hr />

          {/* SUBTOTAL */}
          <div className="summary-row">
            <span>Subtotal</span>
            <strong>Rs. {cartTotal.toLocaleString()}</strong>
          </div>

          {/* DISCOUNT */}
          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: "#16a34a" }}>
              <span>Discount ({appliedCoupon?.code})</span>
              <strong>- Rs. {discountAmount.toLocaleString()}</strong>
            </div>
          )}

          {/* DELIVERY */}
          <div className="summary-row">
            <span>Delivery</span>
            <strong>
              {deliveryCharge === 0 ? "FREE" : `Rs. ${deliveryCharge.toLocaleString()}`}
            </strong>
          </div>

          <hr />

          {/* TOTAL */}
          <div className="summary-total">
            <span>Total</span>
            <strong>Rs. {finalTotal.toLocaleString()}</strong>
          </div>

          {/* INFO */}
          <div className="checkout-summary-note">
            <p>🔐 Payment method is selected on next step (COD or Bank QR Online).</p>
            <p>
              📧 Confirmation will be sent to <strong>{formData.email || "your email"}</strong>.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
