import prisma from "../config/prisma.js";

import fs from "fs";
import path from "path";
import {
  fileURLToPath,
} from "url";

// =====================================================
// __dirname
// =====================================================

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

// =====================================================
// Upload directory
//
// Current file:
// server/src/controllers/galleryController.js
//
// ../../uploads
// = server/uploads
// =====================================================

const uploadDirectory =
  path.resolve(
    __dirname,
    "../../uploads"
  );

// =====================================================
// Delete image helper
// =====================================================

const deleteImageFile = (
  imagePath
) => {
  try {
    if (!imagePath) {
      return;
    }

    // Example:
    // /uploads/12345-image.jpg
    //
    // Convert to:
    // 12345-image.jpg

    const filename =
      path.basename(imagePath);

    const fullPath =
      path.join(
        uploadDirectory,
        filename
      );

    console.log(
      "Trying to delete:",
      fullPath
    );

    if (
      fs.existsSync(fullPath)
    ) {
      fs.unlinkSync(fullPath);

      console.log(
        "✅ Image deleted:",
        fullPath
      );
    } else {
      console.log(
        "⚠️ Image not found:",
        fullPath
      );
    }
  } catch (error) {
    console.error(
      "IMAGE DELETE ERROR:",
      error.message
    );
  }
};

// =====================================================
// ADD GALLERY
// =====================================================

export const addGallery =
  async (req, res) => {
    try {
      console.log(
        "========================================"
      );

      console.log(
        "📸 ADD GALLERY"
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "========================================"
      );

      const {
        title,
        category,
        description,
      } = req.body;

      // =================================================
      // Validate
      // =================================================

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required",
        });
      }

      if (!category?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery category is required",
        });
      }

      // =================================================
      // Image required
      // =================================================

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery image is required",
        });
      }

      // =================================================
      // Image path saved in database
      // =================================================

      const imagePath =
        `/uploads/${req.file.filename}`;

      console.log(
        "💾 Database image path:",
        imagePath
      );

      // =================================================
      // Create gallery
      // =================================================

      const gallery =
        await prisma.gallery.create({
          data: {
            title:
              title.trim(),

            category:
              category.trim(),

            description:
              description?.trim() || "",

            image:
              imagePath,
          },
        });

      console.log(
        "✅ GALLERY CREATED:",
        gallery
      );

      return res.status(201).json({
        success: true,

        message:
          "Gallery item added successfully",

        gallery,
      });
    } catch (error) {
      console.error(
        "ADD GALLERY ERROR:",
        error
      );

      // Delete uploaded file
      // if database creation fails

      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(500).json({
        success: false,
        message:
          "Failed to add gallery item",
        error:
          error.message,
      });
    }
  };

// =====================================================
// GET ALL GALLERY
// =====================================================

export const getGallery =
  async (req, res) => {
    try {
      const gallery =
        await prisma.gallery.findMany({
          orderBy: {
            createdAt: "desc",
          },
        });

      return res.status(200).json({
        success: true,

        count:
          gallery.length,

        gallery,
      });
    } catch (error) {
      console.error(
        "GET GALLERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get gallery",
        error:
          error.message,
      });
    }
  };

// =====================================================
// GET SINGLE GALLERY
// =====================================================

export const getGalleryById =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      const gallery =
        await prisma.gallery.findUnique({
          where: {
            id,
          },
        });

      if (!gallery) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found",
        });
      }

      return res.status(200).json({
        success: true,
        gallery,
      });
    } catch (error) {
      console.error(
        "GET GALLERY BY ID ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get gallery item",
        error:
          error.message,
      });
    }
  };

// =====================================================
// UPDATE GALLERY
// =====================================================

export const updateGallery =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      console.log(
        "========================================"
      );

      console.log(
        "✏️ UPDATE GALLERY"
      );

      console.log(
        "ID:",
        id
      );

      console.log(
        "BODY:",
        req.body
      );

      console.log(
        "FILE:",
        req.file
      );

      console.log(
        "========================================"
      );

      const {
        title,
        category,
        description,
      } = req.body;

      // =================================================
      // Find existing gallery
      // =================================================

      const existing =
        await prisma.gallery.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        if (req.file) {
          deleteImageFile(
            `/uploads/${req.file.filename}`
          );
        }

        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found",
        });
      }

      // =================================================
      // Validate
      // =================================================

      if (!title?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery title is required",
        });
      }

      if (!category?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "Gallery category is required",
        });
      }

      // =================================================
      // Keep old image
      // =================================================

      let imagePath =
        existing.image;

      // =================================================
      // New image uploaded
      // =================================================

      if (req.file) {
        imagePath =
          `/uploads/${req.file.filename}`;

        // Delete old image
        if (existing.image) {
          deleteImageFile(
            existing.image
          );
        }
      }

      // =================================================
      // Update
      // =================================================

      const updated =
        await prisma.gallery.update({
          where: {
            id,
          },

          data: {
            title:
              title.trim(),

            category:
              category.trim(),

            description:
              description?.trim() || "",

            image:
              imagePath,
          },
        });

      return res.status(200).json({
        success: true,

        message:
          "Gallery item updated successfully",

        gallery:
          updated,
      });
    } catch (error) {
      console.error(
        "UPDATE GALLERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update gallery item",
        error:
          error.message,
      });
    }
  };

// =====================================================
// DELETE GALLERY
// =====================================================

export const deleteGallery =
  async (req, res) => {
    try {
      const { id } =
        req.params;

      // =================================================
      // Find gallery
      // =================================================

      const existing =
        await prisma.gallery.findUnique({
          where: {
            id,
          },
        });

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Gallery item not found",
        });
      }

      // =================================================
      // Delete database record
      // =================================================

      await prisma.gallery.delete({
        where: {
          id,
        },
      });

      // =================================================
      // Delete image
      // =================================================

      if (existing.image) {
        deleteImageFile(
          existing.image
        );
      }

      return res.status(200).json({
        success: true,

        message:
          "Gallery item deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE GALLERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete gallery item",
        error:
          error.message,
      });
    }
  };