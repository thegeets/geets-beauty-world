const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.ADMIN_JWT_SECRET || "geets_admin_jwt_secret_key_2026_super_secure"
      );

      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin account not found or invalid token.",
        });
      }

      req.admin = admin;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication failed. Token expired or invalid.",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Admin access denied. No authorization token provided.",
    });
  }
};

module.exports = { protectAdmin };
