const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");

// Helper to generate Admin JWT
const generateAdminToken = (adminId) => {
  return jwt.sign(
    { id: adminId, role: "admin" },
    process.env.ADMIN_JWT_SECRET || "geets_admin_jwt_secret_key_2026_super_secure",
    { expiresIn: "7d" }
  );
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || "").trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both admin username/email and password.",
      });
    }

    // Find admin by email or username
    const admin = await Admin.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    // Compare bcrypt password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin email or password.",
      });
    }

    const token = generateAdminToken(admin._id);

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful.",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        loggedInAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during admin login.",
      error: error.message,
    });
  }
};

// @desc    Get current admin profile
// @route   GET /api/admin/profile
// @access  Private (Admin)
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found.",
      });
    }
    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching admin profile.",
      error: error.message,
    });
  }
};

// @desc    Get all customers with aggregated stats for admin
// @route   GET /api/admin/customers
// @access  Private (Admin)
const getAllCustomers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    const orders = await Order.find();

    // Map customer stats
    const customersWithStats = users.map((user) => {
      const userOrders = orders.filter(
        (o) =>
          (o.user && o.user.toString() === user._id.toString()) ||
          (o.customer && o.customer.email && o.customer.email.toLowerCase() === user.email.toLowerCase())
      );
      const totalSpent = userOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      const lastOrder = userOrders.length > 0 ? userOrders[0].createdAt : null;

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || (userOrders[0]?.customer?.phone || ""),
        city: user.addresses?.[0]?.city || userOrders[0]?.customer?.city || "Nepal",
        ordersCount: userOrders.length,
        totalSpent,
        lastOrder,
        joinedAt: user.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      count: customersWithStats.length,
      customers: customersWithStats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching customers.",
      error: error.message,
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  getAllCustomers,
};
