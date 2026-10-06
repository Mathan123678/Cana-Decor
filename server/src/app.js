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
// ES Module Directory
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// =====================================================
// Body Parsers
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// Other Middleware
// =====================================================

app.use(cookieParser());
app.use(morgan("dev"));

// =====================================================
// Static Uploads
// =====================================================

// server/uploads
const uploadsPath = path.join(
  __dirname,
  "../uploads"
);

console.log(
  "Uploads folder:",
  uploadsPath
);

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// =====================================================
// Routes
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/packages",
  packageRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/contacts",
  contactRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

// =====================================================
// Root
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Event Decoration Management API is running 🚀",
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =====================================================
// Error Handler
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    "GLOBAL ERROR:",
    error
  );

  return res.status(500).json({
    success: false,
    message:
      error.message ||
      "Internal Server Error",
  });
});

// =====================================================
// Export
// =====================================================

export default app;