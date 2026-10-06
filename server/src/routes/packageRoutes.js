import express from "express";

import {
  addPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =====================================================
// PUBLIC ROUTES
// =====================================================

// Get all packages
router.get("/", getPackages);

// Get one package
router.get("/:id", getPackageById);

// =====================================================
// ADMIN ROUTES
// =====================================================

// Add package with image
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addPackage
);

// Update package with optional image
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updatePackage
);

// Delete package
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deletePackage
);

export default router;