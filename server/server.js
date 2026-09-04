const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Server & API Root Information
app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Geets Beauty World Backend Server",
    apiDocumentation: {
      health: "/api/health",
      products: "/api/products",
      orders: "/api/orders",
      reviews: "/api/reviews",
      userAuth: "/api/users/login | /api/users/register",
      adminAuth: "/api/admin/login",
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Geets Beauty World REST API",
    endpoints: {
      products: "GET /api/products | GET /api/products/:id | POST /api/products | PUT /api/products/:id | DELETE /api/products/:id",
      orders: "GET /api/orders | POST /api/orders | GET /api/orders/:id | PUT /api/orders/:id",
      reviews: "GET /api/reviews | POST /api/reviews | PUT /api/reviews/:id | DELETE /api/reviews/:id",
      users: "POST /api/users/register | POST /api/users/login | GET /api/users/profile",
      admin: "POST /api/admin/login | GET /api/admin/profile | GET /api/admin/customers",
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Geets Beauty World API Server",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route ${req.originalUrl} not found.`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`========================================`);
  console.log(`🚀 Geets Beauty World Server running on: http://0.0.0.0:${PORT}`);
  console.log(`📡 Products API: http://localhost:${PORT}/api/products`);
  console.log(`========================================`);
});

module.exports = app;
