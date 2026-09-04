const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Helper to generate Customer JWT
const generateUserToken = (userId) => {
  return jwt.sign(
    { id: userId, role: "customer" },
    process.env.JWT_SECRET || "geets_customer_jwt_secret_key_2026_super_secure",
    { expiresIn: "30d" }
  );
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, password).",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email is already registered.",
      });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      phone: phone || "",
      addresses: [],
      wishlist: [],
    });

    const token = generateUserToken(newUser._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        addresses: newUser.addresses,
        wishlist: newUser.wishlist,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("User registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during user registration.",
      error: error.message,
    });
  }
};

// @desc    User Login
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare bcrypt password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateUserToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during user login.",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (User)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error fetching profile.",
      error: error.message,
    });
  }
};

// @desc    Update user profile & addresses
// @route   PUT /api/users/profile
// @access  Private (User)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const { name, phone, password, addresses, wishlist } = req.body;

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (addresses !== undefined) user.addresses = addresses;
    if (wishlist !== undefined) user.wishlist = wishlist;

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
        wishlist: updatedUser.wishlist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error updating profile.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};
