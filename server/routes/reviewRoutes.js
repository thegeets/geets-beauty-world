const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protectAdmin } = require("../middleware/adminMiddleware");

// GET /api/reviews
router.get("/", getAllReviews);

// POST /api/reviews
router.post("/", createReview);

// PUT /api/reviews/:id (Admin moderation)
router.put("/:id", protectAdmin, updateReview);

// DELETE /api/reviews/:id (Admin deletion)
router.delete("/:id", protectAdmin, deleteReview);

module.exports = router;
