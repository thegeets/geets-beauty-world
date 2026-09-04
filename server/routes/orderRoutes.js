const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// POST /api/orders (Public / Customer)
router.post("/", createOrder);

// GET /api/orders (Query by email or admin view)
router.get("/", getAllOrders);

// GET /api/orders/:id
router.get("/:id", getOrderById);

// PUT /api/orders/:id (Admin status/payment update)
router.put("/:id", protectAdmin, updateOrderStatus);

// DELETE /api/orders/:id (Admin delete)
router.delete("/:id", protectAdmin, deleteOrder);

module.exports = router;
