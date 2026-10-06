import express from "express";

import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ==========================================
// Public Review Routes
// ==========================================

// Get All Reviews
router.get("/", getReviews);

// Get Review By ID
router.get("/:id", getReviewById);

// ==========================================
// Authenticated User Routes
// ==========================================

// Create Review
router.post(
  "/",
  authMiddleware,
  createReview
);

// Update Review
router.put(
  "/:id",
  authMiddleware,
  updateReview
);

// ==========================================
// Delete Review
// ==========================================

// Admin can delete reviews
// Owner can also delete their own review
router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);

export default router;