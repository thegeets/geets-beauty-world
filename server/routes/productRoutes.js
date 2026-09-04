const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products (Admin Only)
router.post("/", protectAdmin, createProduct);

// PUT /api/products/:id (Admin Only)
router.put("/:id", protectAdmin, updateProduct);

// DELETE /api/products/:id (Admin Only)
router.delete("/:id", protectAdmin, deleteProduct);

module.exports = router;
