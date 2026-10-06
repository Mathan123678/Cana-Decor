import express from "express";

import {
  register,
  login,
  googleLogin,
  googleCallback,
  googleTokenLogin,
} from "../controllers/authController.js";

const router = express.Router();

// =====================================================
// Normal Authentication
// =====================================================

router.post(
  "/register",
  register
);

router.post(
  "/login",
  login
);

// =====================================================
// Google Authentication
// =====================================================

// Start Google Login (Redirect flow)
router.get(
  "/google",
  googleLogin
);

// Google OAuth Callback
router.get(
  "/google/callback",
  googleCallback
);

// Direct Google ID Token Verification
router.post(
  "/google/verify",
  googleTokenLogin
);

export default router;