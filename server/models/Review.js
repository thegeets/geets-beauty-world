const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      sparse: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customer: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    product: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productId: {
      type: Number,
      required: false,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Review comment is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Approved", "Pending", "Rejected"],
      default: "Approved",
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre("save", async function () {
  if (this.isNew && (!this.id || this.id === 0)) {
    const highestReview = await this.constructor.findOne({}, { id: 1 }).sort({ id: -1 });
    this.id = highestReview && highestReview.id ? highestReview.id + 1 : 1;
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
