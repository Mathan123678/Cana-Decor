import express from "express";

import {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// Booking Routes
// ==========================================

// Create Booking
// Customer/Admin
router.post(
  "/",
  authMiddleware,
  createBooking
);

// Get All Bookings
// Authenticated users
router.get(
  "/",
  authMiddleware,
  getBookings
);

// Get Booking By ID
// Owner/Admin
router.get(
  "/:id",
  authMiddleware,
  getBookingById
);

// Update Booking
// Owner/Admin
router.put(
  "/:id",
  authMiddleware,
  updateBooking
);

// Delete Booking
// Owner/Admin
router.delete(
  "/:id",
  authMiddleware,
  deleteBooking
);

export default router;