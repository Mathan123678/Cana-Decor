import jwt from "jsonwebtoken";

// =====================================================
// Authentication Middleware
// =====================================================

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // No Authorization header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    // Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    // Get token
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing in .env");

      return res.status(500).json({
        success: false,
        message: "JWT configuration error",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded JWT:", decoded);

    // Attach decoded user to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "AUTH MIDDLEWARE ERROR:",
      error.message
    );

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// =====================================================
// Admin Only Middleware
// =====================================================

export const adminOnly = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.error(
      "ADMIN MIDDLEWARE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

// =====================================================
// Default Export
// =====================================================

export default authMiddleware;