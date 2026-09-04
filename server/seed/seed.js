const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Admin = require("../models/Admin");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/geetsbeauty";
    await mongoose.connect(mongoUri);
    console.log(`[Seed] Connected to MongoDB at ${mongoUri}`);

    // 1. Clean existing collections (preserve Admin collection if already set up)
    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log("[Seed] Refreshed products, reviews, and test orders.");

    // 2. Check Admin Accounts
    const existingAdminCount = await Admin.countDocuments();
    if (existingAdminCount === 0) {
      // Create initial admin only if configured in env, otherwise notify user to run create-admin
      const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
      const adminPass = process.env.INITIAL_ADMIN_PASSWORD;

      if (adminEmail && adminPass) {
        const saltAdmin = await bcrypt.genSalt(10);
        const hashedAdminPassword = await bcrypt.hash(adminPass, saltAdmin);
        await Admin.create({
          name: "Administrator",
          email: adminEmail.toLowerCase().trim(),
          username: adminEmail.split("@")[0],
          password: hashedAdminPassword,
          role: "Super Administrator",
        });
        console.log(`[Seed] Initial admin created from .env config: ${adminEmail}`);
      } else {
        console.log("[Seed] No admin account found. Run 'npm run create-admin' to create your secure admin account.");
      }
    } else {
      console.log(`[Seed] Preserved ${existingAdminCount} existing custom administrator account(s).`);
    }

    // 3. Seed Demo Users
    const saltUser = await bcrypt.genSalt(10);
    const hashedUserPassword = await bcrypt.hash("demo123", saltUser);
    const demoUser = await User.create({
      name: "Glow Customer",
      email: "demo@gmail.com",
      password: hashedUserPassword,
      phone: "9812345678",
      addresses: [
        {
          label: "Home",
          province: "Bagmati",
          city: "Kathmandu",
          area: "Baneshwor",
          street: "Shanti Marga 3",
          isDefault: true,
        },
      ],
      wishlist: [1, 3],
      role: "customer",
    });

    const user2 = await User.create({
      name: "Anjali Shrestha",
      email: "anjali.s@gmail.com",
      password: await bcrypt.hash("anjali123", saltUser),
      phone: "9841234567",
      addresses: [
        {
          label: "Home",
          province: "Gandaki",
          city: "Pokhara",
          area: "Lakeside",
          street: "Street 16, House 45",
          isDefault: true,
        },
      ],
      role: "customer",
    });
    console.log("[Seed] Demo users created (demo@gmail.com / demo123, anjali.s@gmail.com).");

    // 4. Seed Products
    let defaultProducts = [];
    try {
      const frontendProductsPath = path.join(__dirname, "../../src/data/products.js");
      const fs = require("fs");
      if (fs.existsSync(frontendProductsPath)) {
        let fileContent = fs.readFileSync(frontendProductsPath, "utf-8");
        fileContent = fileContent.replace(/^\s*export\s+const\s+products\s*=\s*/m, "").trim();
        if (fileContent.endsWith(";")) {
          fileContent = fileContent.slice(0, -1);
        }
        defaultProducts = JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn("[Seed] Warning parsing frontend products.js as JSON, trying Function eval:", e.message);
      try {
        const frontendProductsPath = path.join(__dirname, "../../src/data/products.js");
        const fs = require("fs");
        const fileContent = fs.readFileSync(frontendProductsPath, "utf-8");
        const rawCode = fileContent.replace(/export\s+const\s+products\s*=\s*/, "return ");
        defaultProducts = new Function(rawCode)();
      } catch (err2) {
        console.error("[Seed] Could not eval products:", err2.message);
      }
    }

    if (!defaultProducts || defaultProducts.length === 0) {
      defaultProducts = [
        {
          id: 1,
          name: "Hydrating Glow Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 1299,
          rating: 4.8,
          badge: "Best Seller",
          image: "/Hydrating Glow Serum.png",
          hoverImage: "/Hydrating Glow Serum.1.png",
          description: "A lightweight serum for hydrated and radiant-looking skin.",
          inStock: true,
          stock: 15,
        },
        {
          id: 2,
          name: "Vitamin C Brightening Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 1199,
          oldPrice: 1499,
          rating: 4.7,
          badge: "Popular",
          image: "/vitamin c brightening serum.png",
          hoverImage: "/Vitamin C Brightening Serum22.png",
          description: "Brightening serum for a fresh and glowing complexion.",
          inStock: true,
          stock: 15,
        },
        {
          id: 3,
          name: "Hyaluronic Acid Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 1099,
          rating: 4.9,
          badge: "Trending",
          image: "/Hyaluronic Acid Serum.jpeg",
          hoverImage: "/Hyaluronic Acid Serum.1.png",
          description: "Deeply hydrating serum for soft and plump-looking skin.",
          inStock: true,
          stock: 15,
        },
        {
          id: 4,
          name: "Niacinamide Face Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 999,
          rating: 4.8,
          badge: "Best Seller",
          image: "/Niacinamide Face Serum.png",
          hoverImage: "/Niacinamide Face Serum1.png",
          description: "Lightweight serum designed for balanced-looking skin.",
          inStock: true,
          stock: 15,
        },
        {
          id: 5,
          name: "Salicylic Acid Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 899,
          rating: 4.6,
          badge: "New",
          image: "/Salicylic Acid Serum.png",
          hoverImage: "/Salicylic Acid Face Wash2.jpg",
          description: "Gentle exfoliating serum for clearer-looking skin.",
          inStock: true,
          stock: 15,
        },
        {
          id: 6,
          name: "Retinol Night Serum",
          category: "Skincare",
          subcategory: "Serum",
          price: 1499,
          rating: 4.7,
          badge: "Premium",
          image: "/Retinol Night Serum.png",
          hoverImage: "/Retinol Night Serum.1.jpg",
          description: "Night serum designed to support smoother-looking skin.",
          inStock: false,
          stock: 0,
        },
      ];
    }

    const formattedProducts = defaultProducts.map((p, idx) => ({
      id: p.id || idx + 1,
      name: p.name,
      category: p.category || "Skincare",
      subcategory: p.subcategory || "General",
      brand: p.brand || "Geets Beauty",
      price: Number(p.price) || 999,
      oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
      rating: Number(p.rating) || 4.8,
      badge: p.badge || "New",
      image: p.image || "/Hydrating Glow Serum.png",
      hoverImage: p.hoverImage || "",
      description: p.description || "Premium beauty formulation for radiant, healthy glow.",
      stock: p.stock !== undefined ? Number(p.stock) : (p.inStock === false ? 0 : 15),
      inStock: p.inStock !== undefined ? p.inStock : (p.stock === 0 ? false : true),
      soldCount: p.soldCount || Math.floor(Math.random() * 50) + 10,
    }));

    await Product.insertMany(formattedProducts);
    console.log(`[Seed] Seeded ${formattedProducts.length} products successfully.`);

    // 5. Seed Orders
    const initialOrders = [
      {
        orderId: "GBW-173890201",
        user: user2._id,
        customer: {
          fullName: "Anjali Shrestha",
          email: "anjali.s@gmail.com",
          phone: "9841234567",
          province: "Gandaki",
          city: "Pokhara",
          area: "Lakeside - Street 16",
          address: "House 45, Near Peace Garden",
        },
        items: [
          { id: 1, name: "Hydrating Glow Serum", price: 1299, quantity: 1, image: "/Hydrating Glow Serum.png" },
          { id: 3, name: "Hyaluronic Acid Serum", price: 1099, quantity: 1, image: "/Hyaluronic Acid Serum.jpeg" },
        ],
        subtotal: 2398,
        deliveryCharge: 0,
        discount: 239,
        couponCode: "GEETS10",
        total: 2159,
        paymentMethod: "Online Payment - Bank QR",
        paymentStatus: "Verified",
        orderStatus: "Delivered",
        deliveryMethod: "Home Delivery",
        statusHistory: [
          { status: "Placed", time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { status: "Confirmed", time: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000) },
          { status: "Shipped", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
          { status: "Delivered", time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: "GBW-173894520",
        customer: {
          fullName: "Pooja Gurung",
          email: "pooja.g@hotmail.com",
          phone: "9806543210",
          province: "Gandaki",
          city: "Pokhara",
          area: "New Road",
          address: "Shop 12, Trade Complex",
        },
        items: [
          { id: 2, name: "Vitamin C Brightening Serum", price: 1199, quantity: 2, image: "/vitamin c brightening serum.png" },
          { id: 4, name: "Niacinamide Face Serum", price: 999, quantity: 1, image: "/Niacinamide Face Serum.png" },
        ],
        subtotal: 3397,
        deliveryCharge: 0,
        discount: 679,
        couponCode: "GLOW20",
        total: 2718,
        paymentMethod: "Cash on Delivery",
        paymentStatus: "Pending on Delivery",
        orderStatus: "Out for Delivery",
        deliveryMethod: "Home Delivery",
        statusHistory: [
          { status: "Placed", time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
          { status: "Confirmed", time: new Date(Date.now() - 20 * 60 * 60 * 1000) },
          { status: "Shipped", time: new Date(Date.now() - 6 * 60 * 60 * 1000) },
        ],
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        orderId: "GBW-173901188",
        user: demoUser._id,
        customer: {
          fullName: "Glow Customer",
          email: "demo@gmail.com",
          phone: "9812345678",
          province: "Bagmati",
          city: "Kathmandu",
          area: "Baneshwor",
          address: "Shanti Marga 3",
        },
        items: [
          { id: 1, name: "Hydrating Glow Serum", price: 1299, quantity: 1, image: "/Hydrating Glow Serum.png" },
        ],
        subtotal: 1299,
        deliveryCharge: 150,
        discount: 0,
        couponCode: null,
        total: 1449,
        paymentMethod: "Online Payment - Bank QR",
        paymentStatus: "Payment Screenshot Submitted",
        orderStatus: "Pending",
        deliveryMethod: "Courier Delivery",
        statusHistory: [
          { status: "Placed", time: new Date(Date.now() - 4 * 60 * 60 * 1000) },
        ],
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
    ];

    await Order.insertMany(initialOrders);
    console.log("[Seed] Seeded initial orders.");

    // 6. Seed Reviews
    const initialReviews = [
      {
        id: 1,
        customer: "Pooja Gurung",
        customerEmail: "pooja.g@hotmail.com",
        product: "Vitamin C Brightening Serum",
        productId: 2,
        rating: 5,
        comment:
          "The Vitamin C Serum completely changed my skincare game. My dark spots faded within 3 weeks and my skin feels deeply nourished!",
        status: "Approved",
        date: "2025-02-18",
      },
      {
        id: 2,
        customer: "Anjali Shrestha",
        customerEmail: "anjali.s@gmail.com",
        product: "Hydrating Glow Serum",
        productId: 1,
        rating: 5,
        comment:
          "I love the lightweight dewy texture. It absorbs instantly without any greasiness. 10/10 recommendation!",
        status: "Approved",
        date: "2025-02-20",
      },
      {
        id: 3,
        customer: "Sunita Adhikari",
        customerEmail: "sunita.adhikari@gmail.com",
        product: "Rosemary Hair Oil",
        productId: 31,
        rating: 5,
        comment:
          "Hands down the best herbal hair oil in Nepal. Reduced my hair shedding noticeably and gave my curls a healthy shine.",
        status: "Approved",
        date: "2025-02-22",
      },
      {
        id: 4,
        customer: "Kopila Thapa",
        customerEmail: "kopila.thapa@gmail.com",
        product: "Niacinamide Face Serum",
        productId: 4,
        rating: 4,
        comment:
          "Great pore refining serum. Very gentle on sensitive Nepali skin. Fast delivery in Pokhara.",
        status: "Pending",
        date: "2025-02-24",
      },
      {
        id: 5,
        customer: "Roshani KC",
        customerEmail: "roshani.kc@gmail.com",
        product: "Matte Velvet Lipstick #04",
        productId: 22,
        rating: 5,
        comment:
          "Very pigmented and long lasting. Doesn't dry out my lips at all during whole day wear.",
        status: "Approved",
        date: "2025-02-25",
      },
    ];

    await Review.insertMany(initialReviews);
    console.log("[Seed] Seeded initial reviews.");

    console.log("==========================================");
    console.log("✅ SEEDING COMPLETE!");
    console.log("Admin credentials (DEMO ONLY):");
    console.log("  Email: admin@geetsbeauty.com");
    console.log("  Password: admin123");
    console.log("Customer credentials (DEMO ONLY):");
    console.log("  Email: demo@gmail.com");
    console.log("  Password: demo123");
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("[Seed] Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
