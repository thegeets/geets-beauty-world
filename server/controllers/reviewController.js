const Review = require("../models/Review");

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const { productId, status, search } = req.query;
    let query = {};

    if (productId) {
      query.productId = Number(productId);
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { customer: { $regex: search, $options: "i" } },
        { product: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } },
      ];
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching reviews.",
      error: error.message,
    });
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Public (or authenticated)
const createReview = async (req, res) => {
  try {
    const { customer, customerEmail, product, productId, rating, comment, status } = req.body;

    if (!customer || !product || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Customer name, product, rating, and comment are required.",
      });
    }

    const newReview = await Review.create({
      user: req.user ? req.user._id : undefined,
      customer: customer.trim(),
      customerEmail: customerEmail ? customerEmail.trim().toLowerCase() : "",
      product: product.trim(),
      productId: productId ? Number(productId) : undefined,
      rating: Number(rating),
      comment: comment.trim(),
      status: status || "Approved",
      date: new Date().toISOString().split("T")[0],
    });

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      review: newReview,
    });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error submitting review.",
      error: error.message,
    });
  }
};

// @desc    Update review status or content
// @route   PUT /api/reviews/:id
// @access  Private (Admin)
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, comment, rating } = req.body;

    let review = null;
    if (!isNaN(id)) {
      review = await Review.findOne({ id: Number(id) });
    }
    if (!review && id.match(/^[0-9a-fA-F]{24}$/)) {
      review = await Review.findById(id);
    }

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review #${id} not found.`,
      });
    }

    if (status) review.status = status;
    if (comment) review.comment = comment.trim();
    if (rating) review.rating = Number(rating);

    const updatedReview = await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error updating review.",
      error: error.message,
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    let review = null;
    if (!isNaN(id)) {
      review = await Review.findOneAndDelete({ id: Number(id) });
    } else if (id.match(/^[0-9a-fA-F]{24}$/)) {
      review = await Review.findByIdAndDelete(id);
    }

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review #${id} not found.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error deleting review.",
      error: error.message,
    });
  }
};

module.exports = {
  getAllReviews,
  createReview,
  updateReview,
  deleteReview,
};
