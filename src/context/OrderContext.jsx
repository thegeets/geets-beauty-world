import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";
import apiRequest from "../api/apiClient";

const OrderContext = createContext(null);

const DEFAULT_COUPONS = [
  { code: "GLOW20", discountPercent: 20, minSpend: 1500, description: "20% OFF on orders over Rs. 1,500", isActive: true },
  { code: "GEETS10", discountPercent: 10, minSpend: 0, description: "10% OFF on all items", isActive: true },
  { code: "WELCOME500", discountFlat: 500, minSpend: 3000, description: "Flat Rs. 500 OFF on orders over Rs. 3,000", isActive: true },
  { code: "FESTIVE15", discountPercent: 15, minSpend: 2000, description: "15% Festive discount", isActive: true },
];

const INITIAL_ORDERS = [
  {
    orderId: "GBW-173890201",
    customer: {
      fullName: "Anjali Shrestha",
      email: "anjali.s@gmail.com",
      phone: "9841234567",
      province: "Gandaki",
      city: "Pokhara",
      area: "Lakeside - Street 16",
      address: "House 45, Near Peace Garden",
    },
    items: [
      { id: 1, name: "Hydrating Glow Serum", price: 1299, quantity: 1, image: "/Hydrating Glow Serum.png" },
      { id: 3, name: "Hyaluronic Acid Serum", price: 1099, quantity: 1, image: "/Hyaluronic Acid Serum.jpeg" },
    ],
    subtotal: 2398,
    deliveryCharge: 0,
    discount: 239,
    couponCode: "GEETS10",
    total: 2159,
    paymentMethod: "Online Payment - Bank QR",
    paymentStatus: "Verified",
    orderStatus: "Delivered",
    deliveryMethod: "Home Delivery",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: "Placed", time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Confirmed", time: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Shipped", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Delivered", time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    orderId: "GBW-173894520",
    customer: {
      fullName: "Pooja Gurung",
      email: "pooja.g@hotmail.com",
      phone: "9806543210",
      province: "Gandaki",
      city: "Pokhara",
      area: "New Road",
      address: "Shop 12, Trade Complex",
    },
    items: [
      { id: 2, name: "Vitamin C Brightening Serum", price: 1199, quantity: 2, image: "/vitamin c brightening serum.png" },
      { id: 4, name: "Niacinamide Face Serum", price: 999, quantity: 1, image: "/Niacinamide Face Serum.png" },
    ],
    subtotal: 3397,
    deliveryCharge: 0,
    discount: 679,
    couponCode: "GLOW20",
    total: 2718,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending on Delivery",
    orderStatus: "Out for Delivery",
    deliveryMethod: "Home Delivery",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: "Placed", time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Confirmed", time: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString() },
      { status: "Shipped", time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
    ],
  },
  {
    orderId: "GBW-173901188",
    customer: {
      fullName: "Glow Customer",
      email: "demo@gmail.com",
      phone: "9812345678",
      province: "Bagmati",
      city: "Kathmandu",
      area: "Baneshwor",
      address: "Shanti Marga 3",
    },
    items: [
      { id: 1, name: "Hydrating Glow Serum", price: 1299, quantity: 1, image: "/Hydrating Glow Serum.png" },
    ],
    subtotal: 1299,
    deliveryCharge: 150,
    discount: 0,
    couponCode: null,
    total: 1449,
    paymentMethod: "Online Payment - Bank QR",
    paymentStatus: "Payment Screenshot Submitted",
    orderStatus: "Pending",
    deliveryMethod: "Courier Delivery",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    statusHistory: [
      { status: "Placed", time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
    ],
  },
];

export function OrderProvider({ children }) {
  const { addToast } = useToast();

  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem("geets-all-orders");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading orders:", e);
    }
    return INITIAL_ORDERS;
  });

  // Fetch orders from backend on load
  useEffect(() => {
    apiRequest("/orders")
      .then((res) => {
        if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
          setOrders(res.orders);
        }
      })
      .catch(() => {});
  }, []);

  const [coupons, setCoupons] = useState(() => {
    try {
      const stored = localStorage.getItem("geets-coupons");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Error reading coupons:", e);
    }
    return DEFAULT_COUPONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem("geets-all-orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders:", e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("geets-coupons", JSON.stringify(coupons));
    } catch (e) {
      console.error("Error saving coupons:", e);
    }
  }, [coupons]);

  // Create Order
  const createOrder = async (orderData) => {
    const newOrder = {
      ...orderData,
      orderId: orderData.orderId || `GBW-${Date.now().toString().slice(-8)}`,
      createdAt: orderData.createdAt || new Date().toISOString(),
      orderStatus: orderData.orderStatus || "Pending",
      statusHistory: [
        { status: "Placed", time: new Date().toISOString() },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    addToast(`Order ${newOrder.orderId} created successfully!`, "success");

    // Backend sync
    try {
      const res = await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(newOrder),
      });
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o.orderId === newOrder.orderId ? res.order : o)));
        return res.order;
      }
    } catch (e) {
      console.warn("Could not sync created order to backend:", e);
    }

    return newOrder;
  };

  // Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          const history = order.statusHistory || [];
          return {
            ...order,
            orderStatus: newStatus,
            paymentStatus: newStatus === "Delivered" && order.paymentMethod.includes("Cash") ? "Paid on Delivery" : order.paymentStatus,
            statusHistory: [...history, { status: newStatus, time: new Date().toISOString() }],
          };
        }
        return order;
      })
    );
    addToast(`Order #${orderId} status updated to "${newStatus}"`, "info");

    // Backend sync
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        useAdminToken: true,
        body: JSON.stringify({ orderStatus: newStatus }),
      });
    } catch (e) {
      console.warn(`Could not sync updated order ${orderId} to backend:`, e);
    }
  };

  // Verify Online Payment Screenshot
  const verifyPayment = async (orderId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderId === orderId) {
          return {
            ...order,
            paymentStatus: "Verified",
          };
        }
        return order;
      })
    );
    addToast(`Payment for Order #${orderId} has been verified!`, "success");

    // Backend sync
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        useAdminToken: true,
        body: JSON.stringify({ paymentStatus: "Verified" }),
      });
    } catch (e) {
      console.warn(`Could not sync payment verification for ${orderId}:`, e);
    }
  };

  // Delete Order
  const deleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    addToast(`Order #${orderId} removed`, "info");

    // Backend sync
    try {
      await apiRequest(`/orders/${orderId}`, {
        method: "DELETE",
        useAdminToken: true,
      });
    } catch (e) {
      console.warn(`Could not sync deleted order ${orderId}:`, e);
    }
  };

  // Coupon Operations
  const validateCoupon = (code, subtotal) => {
    if (!code) return { valid: false, message: "Please enter a coupon code." };
    const cleanCode = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!coupon) {
      return { valid: false, message: "Invalid or expired coupon code." };
    }

    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        valid: false,
        message: `Minimum spend of Rs. ${coupon.minSpend.toLocaleString()} required for this coupon.`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountPercent) {
      discountAmount = Math.round((subtotal * coupon.discountPercent) / 100);
    } else if (coupon.discountFlat) {
      discountAmount = Math.min(coupon.discountFlat, subtotal);
    }

    return {
      valid: true,
      coupon,
      discountAmount,
      message: `Coupon "${coupon.code}" applied! You saved Rs. ${discountAmount.toLocaleString()}`,
    };
  };

  const addCoupon = (newCoupon) => {
    const couponObj = {
      code: newCoupon.code.toUpperCase().trim(),
      discountPercent: newCoupon.discountPercent ? Number(newCoupon.discountPercent) : undefined,
      discountFlat: newCoupon.discountFlat ? Number(newCoupon.discountFlat) : undefined,
      minSpend: Number(newCoupon.minSpend) || 0,
      description: newCoupon.description || `Special discount voucher`,
      isActive: true,
    };
    setCoupons((prev) => [couponObj, ...prev]);
    addToast(`Coupon "${couponObj.code}" created!`, "success");
  };

  const toggleCoupon = (code) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    addToast(`Coupon deleted`, "info");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        coupons,
        createOrder,
        updateOrderStatus,
        verifyPayment,
        deleteOrder,
        validateCoupon,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within OrderProvider");
  }
  return context;
}
