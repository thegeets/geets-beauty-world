const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },
    subcategory: {
      type: String,
      default: "General",
      trim: true,
    },
    brand: {
      type: String,
      default: "Geets Beauty",
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    oldPrice: {
      type: Number,
      default: null,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    badge: {
      type: String,
      default: "New",
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Product image is required"],
      trim: true,
    },
    hoverImage: {
      type: String,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      default: "Premium beauty formulation for radiant, healthy glow.",
      trim: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 15,
      min: [0, "Stock cannot be negative"],
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-assign numeric id if not provided
productSchema.pre("save", async function () {
  if (this.isNew && (!this.id || this.id === 0)) {
    const highestProduct = await this.constructor.findOne({}, { id: 1 }).sort({ id: -1 });
    this.id = highestProduct && highestProduct.id ? highestProduct.id + 1 : 1;
  }
  // Sync inStock with stock quantity
  this.inStock = Number(this.stock) > 0;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
