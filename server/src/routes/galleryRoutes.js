import express from "express";

import {
  addGallery,
  getGallery,
  getGalleryById,
  updateGallery,
  deleteGallery,
} from "../controllers/galleryController.js";

import  authMiddleware  from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// =====================================================
// PUBLIC
// =====================================================

router.get(
  "/",
  getGallery
);

router.get(
  "/:id",
  getGalleryById
);

// =====================================================
// ADMIN
// =====================================================

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  addGallery
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateGallery
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteGallery
);

export default router;