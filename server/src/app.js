import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

// =====================================================
// ES MODULE DIRECTORY
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  // Production frontend
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,

  // Local development
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without Origin header
      // Example: Postman, curl, server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins only
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
  })
);

// =====================================================
// BODY PARSERS
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// OTHER MIDDLEWARE
// =====================================================

app.use(cookieParser());

app.use(morgan("dev"));

// =====================================================
// STATIC UPLOADS
// =====================================================

// server/uploads
const uploadsPath = path.join(__dirname, "../uploads");

console.log("Uploads folder:", uploadsPath);

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Users
app.use(
  "/api/users",
  userRoutes
);

// Packages
app.use(
  "/api/packages",
  packageRoutes
);

// Bookings
app.use(
  "/api/bookings",
  bookingRoutes
);

// Gallery
app.use(
  "/api/gallery",
  galleryRoutes
);

// Reviews
app.use(
  "/api/reviews",
  reviewRoutes
);

// Contact
app.use(
  "/api/contacts",
  contactRoutes
);

// Admin
app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// API TEST ROUTE
// =====================================================

app.get("/api/auth/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth route is working",
  });
});

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Decoration Management API is running 🚀",
  });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("GLOBAL ERROR:", error);

  // CORS error
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request",
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// =====================================================
// EXPORT
// =====================================================

export default app;