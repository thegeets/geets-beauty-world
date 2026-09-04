const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectUser = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "geets_customer_jwt_secret_key_2026_super_secure"
      );

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User session not found or invalid token.",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token failed or expired.",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }
};

module.exports = { protectUser };
