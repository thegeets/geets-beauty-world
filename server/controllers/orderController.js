const Order = require("../models/Order");
const Product = require("../models/Product");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest or logged in user)
const createOrder = async (req, res) => {
  try {
    const {
      orderId,
      customer,
      items,
      subtotal,
      deliveryCharge,
      discount,
      couponCode,
      total,
      paymentMethod,
      paymentStatus,
      deliveryMethod,
      orderStatus,
    } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.email) {
      return res.status(400).json({
        success: false,
        message: "Customer full name, phone, and email are required.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item.",
      });
    }

    const assignedOrderId = orderId || `GBW-${Date.now().toString().slice(-8)}`;

    const newOrder = await Order.create({
      orderId: assignedOrderId,
      user: req.user ? req.user._id : undefined,
      customer: {
        fullName: customer.fullName.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        province: customer.province || "Gandaki",
        city: customer.city || "Pokhara",
        area: customer.area || "",
        address: customer.address || "",
      },
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: Number(it.price),
        quantity: Number(it.quantity || 1),
        image: it.image || "",
      })),
      subtotal: Number(subtotal),
      deliveryCharge: Number(deliveryCharge || 0),
      discount: Number(discount || 0),
      couponCode: couponCode || null,
      total: Number(total),
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus:
        paymentStatus ||
        (paymentMethod === "Cash on Delivery" ? "Pending on Delivery" : "Pending"),
      orderStatus: orderStatus || "Pending",
      deliveryMethod: deliveryMethod || "Home Delivery",
      statusHistory: [
        {
          status: "Placed",
          time: new Date(),
        },
      ],
    });

    // Optionally decrement product stock
    for (const it of items) {
      if (it.id) {
        await Product.findOneAndUpdate(
          { id: it.id, stock: { $gte: it.quantity } },
          { $inc: { stock: -Number(it.quantity), soldCount: Number(it.quantity) } }
        );
      }
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: newOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating order.",
      error: error.message,
    });
  }
};

// @desc    Get orders (Admin sees all; Customer sees their own; Query by email)
// @route   GET /api/orders
// @access  Public / Protected
const getAllOrders = async (req, res) => {
  try {
    const { email, orderStatus, search } = req.query;
    let query = {};

    // If customer token present, limit to their orders
    if (req.user) {
      query.$or = [{ user: req.user._id }, { "customer.email": req.user.email.toLowerCase() }];
    } else if (email) {
      query["customer.email"] = email.toLowerCase().trim();
    }

    if (orderStatus && orderStatus !== "All") {
      query.orderStatus = orderStatus;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.fullName": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching orders.",
      error: error.message,
    });
  }
};

// @desc    Get order by ID or orderId
// @route   GET /api/orders/:id
// @access  Public / Customer / Admin
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching order details.",
      error: error.message,
    });
  }
};

// @desc    Update order status or payment status
// @route   PUT /api/orders/:id
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus, deliveryMethod } = req.body;

    let order = await Order.findOne({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${id} not found.`,
      });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      order.statusHistory.push({
        status: orderStatus,
        time: new Date(),
      });

      if (orderStatus === "Delivered" && order.paymentMethod.includes("Cash")) {
        order.paymentStatus = "Paid on Delivery";
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    if (deliveryMethod) {
      order.deliveryMethod = deliveryMethod;
    }

    const updatedOrder = await order.save();

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderId} updated successfully.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating order.",
      error: error.message,
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    let order = await Order.findOneAndDelete({ orderId: id });
    if (!order && id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findByIdAndDelete(id);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order #${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order #${order.orderId} deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error deleting order.",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
