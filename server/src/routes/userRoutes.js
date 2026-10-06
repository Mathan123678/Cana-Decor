import express from "express";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================================
// USER PROFILE
// =====================================================

// Get current logged-in user
router.get(
  "/me",
  authMiddleware,
  getMyProfile
);

// Existing profile route
router.get(
  "/profile",
  authMiddleware,
  getMyProfile
);

// =====================================================
// UPDATE PROFILE
// =====================================================

router.put(
  "/me",
  authMiddleware,
  updateMyProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateMyProfile
);

// =====================================================
// CHANGE PASSWORD
// =====================================================

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

router.put(
  "/password",
  authMiddleware,
  changePassword
);

export default router;