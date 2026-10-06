import express from "express";

import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTE
// =====================================================

// Customer sends contact message
router.post(
  "/",
  createContact
);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Get all contact messages
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getContacts
);

// Get one contact message
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getContactById
);

// Update contact status
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateContact
);

// Delete contact message
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteContact
);

export default router;