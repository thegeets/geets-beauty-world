const express = require("express");
const router = express.Router();
const {
  adminLogin,
  getAdminProfile,
  getAllCustomers,
} = require("../controllers/adminController");
const { protectAdmin } = require("../middleware/adminMiddleware");
const rateLimit = require("express-rate-limit");

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 admin login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many admin login attempts from this IP. Please try again after 15 minutes.",
  },
});

// POST /api/admin/login (Rate limited & secure)
router.post("/login", adminLoginLimiter, adminLogin);

// GET /api/admin/profile (Protected)
router.get("/profile", protectAdmin, getAdminProfile);

// GET /api/admin/customers (Protected)
router.get("/customers", protectAdmin, getAllCustomers);

module.exports = router;
