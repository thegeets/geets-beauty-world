const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protectUser } = require("../middleware/authMiddleware");

// POST /api/users/register
router.post("/register", registerUser);

// POST /api/users/login
router.post("/login", loginUser);

// GET /api/users/profile (Protected)
router.get("/profile", protectUser, getUserProfile);

// PUT /api/users/profile (Protected)
router.put("/profile", protectUser, updateUserProfile);

module.exports = router;
