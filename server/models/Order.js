const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: "" },
});

const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  time: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, default: "Gandaki" },
      city: { type: String, default: "Pokhara" },
      area: { type: String, default: "" },
      address: { type: String, default: "" },
    },
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Cash on Delivery",
    },
    paymentStatus: {
      type: String,
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    deliveryMethod: {
      type: String,
      default: "Home Delivery",
    },
    statusHistory: [statusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save to add status history if new
orderSchema.pre("save", function () {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [{ status: this.orderStatus || "Placed", time: new Date() }];
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
