import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
  // Dashboard
  getDashboardStats,

  // Users
  getAllUsers,
  getUserById,
  deleteUser,

  // Bookings
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,

  // Contacts
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/adminController.js";

const router = express.Router();

// ==========================================
// Admin Test
// ==========================================

router.get(
  "/test",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Admin access granted",
      admin: req.user,
    });
  }
);

// ==========================================
// Dashboard
// ==========================================

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// ==========================================
// Users
// ==========================================

// Get All Users
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

// Get User By ID
router.get(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  getUserById
);

// Delete User
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

// ==========================================
// Bookings
// ==========================================

// Get All Bookings
router.get(
  "/bookings",
  authMiddleware,
  adminMiddleware,
  getAllBookings
);

// Get Booking By ID
router.get(
  "/bookings/:id",
  authMiddleware,
  adminMiddleware,
  getBookingById
);

// Update Booking Status
router.put(
  "/bookings/:id/status",
  authMiddleware,
  adminMiddleware,
  updateBookingStatus
);

// Delete Booking
router.delete(
  "/bookings/:id",
  authMiddleware,
  adminMiddleware,
  deleteBooking
);

// ==========================================
// Contacts
// ==========================================

// Get All Contacts
router.get(
  "/contacts",
  authMiddleware,
  adminMiddleware,
  getAllContacts
);

// Get Contact By ID
router.get(
  "/contacts/:id",
  authMiddleware,
  adminMiddleware,
  getContactById
);

// Update Contact Status
router.put(
  "/contacts/:id/status",
  authMiddleware,
  adminMiddleware,
  updateContactStatus
);

// Delete Contact
router.delete(
  "/contacts/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

export default router;