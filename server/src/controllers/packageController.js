import prisma from "../config/prisma.js";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// =====================================================
// __dirname
// =====================================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================================
// Upload directory
//
// Current file:
// server/src/controllers/packageController.js
//
// ../../uploads
// → server/uploads
// =====================================================

const uploadDirectory = path.join(
  __dirname,
  "../../uploads"
);

// =====================================================
// Delete image file
// =====================================================

const deleteImageFile = (imagePath) => {
  try {
    if (!imagePath) {
      return;
    }

    const filename = path.basename(imagePath);

    const fullPath = path.join(
      uploadDirectory,
      filename
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);

      console.log(
        "Deleted image:",
        fullPath
      );
    } else {
      console.log(
        "Image not found:",
        fullPath
      );
    }
  } catch (error) {
    console.error(
      "Image delete error:",
      error.message
    );
  }
};

// =====================================================
// ADD PACKAGE
// =====================================================

export const addPackage = async (req, res) => {
  try {
    console.log(
      "========== ADD PACKAGE =========="
    );

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      category,
      price,
    } = req.body;

    // =================================================
    // Validate fields
    // =================================================

    if (
      !title ||
      !description ||
      !category ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, description, category and price are required",
      });
    }

    // =================================================
    // Validate image
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Package image is required",
      });
    }

    // =================================================
    // Validate price
    // =================================================

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price",
      });
    }

    // =================================================
    // Image URL stored in database
    // =================================================

    const imagePath =
      `/uploads/${req.file.filename}`;

    console.log(
      "Saved image path:",
      imagePath
    );

    // =================================================
    // Create package
    // =================================================

    const newPackage =
      await prisma.package.create({
        data: {
          title: title.trim(),

          description:
            description.trim(),

          category:
            category.trim(),

          price: numericPrice,

          image: imagePath,
        },
      });

    console.log(
      "PACKAGE CREATED:",
      newPackage
    );

    // =================================================
    // Response
    // =================================================

    return res.status(201).json({
      success: true,

      message:
        "Package Added Successfully",

      package: newPackage,
    });
  } catch (error) {
    console.error(
      "ADD PACKAGE ERROR:",
      error
    );

    // =================================================
    // Delete uploaded image if DB fails
    // =================================================

    if (req.file) {
      deleteImageFile(
        `/uploads/${req.file.filename}`
      );
    }

    return res.status(500).json({
      success: false,

      message: "Server Error",

      error: error.message,
    });
  }
};

// =====================================================
// GET ALL PACKAGES
// =====================================================

export const getPackages = async (
  req,
  res
) => {
  try {
    const packages =
      await prisma.package.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return res.status(200).json({
      success: true,

      count: packages.length,

      packages,
    });
  } catch (error) {
    console.error(
      "GET PACKAGES ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Server Error",

      error: error.message,
    });
  }
};

// =====================================================
// GET PACKAGE BY ID
// =====================================================

export const getPackageById = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const packageData =
      await prisma.package.findUnique({
        where: {
          id,
        },
      });

    if (!packageData) {
      return res.status(404).json({
        success: false,

        message: "Package Not Found",
      });
    }

    return res.status(200).json({
      success: true,

      package: packageData,
    });
  } catch (error) {
    console.error(
      "GET PACKAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Server Error",

      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PACKAGE
// =====================================================

export const updatePackage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    console.log(
      "========== UPDATE PACKAGE =========="
    );

    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      title,
      description,
      category,
      price,
    } = req.body;

    // =================================================
    // Find package
    // =================================================

    const existingPackage =
      await prisma.package.findUnique({
        where: {
          id,
        },
      });

    if (!existingPackage) {
      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(404).json({
        success: false,

        message: "Package Not Found",
      });
    }

    // =================================================
    // Validate
    // =================================================

    if (
      !title ||
      !description ||
      !category ||
      !price
    ) {
      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,

        message:
          "Title, description, category and price are required",
      });
    }

    // =================================================
    // Validate price
    // =================================================

    const numericPrice = Number(price);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      if (req.file) {
        deleteImageFile(
          `/uploads/${req.file.filename}`
        );
      }

      return res.status(400).json({
        success: false,

        message: "Invalid price",
      });
    }

    // =================================================
    // Keep old image
    // =================================================

    let imagePath =
      existingPackage.image;

    // =================================================
    // New image uploaded
    // =================================================

    if (req.file) {
      imagePath =
        `/uploads/${req.file.filename}`;
    }

    // =================================================
    // Update database
    // =================================================

    const updatedPackage =
      await prisma.package.update({
        where: {
          id,
        },

        data: {
          title:
            title.trim(),

          description:
            description.trim(),

          category:
            category.trim(),

          price:
            numericPrice,

          image:
            imagePath,
        },
      });

    // =================================================
    // Delete old image AFTER successful DB update
    // =================================================

    if (
      req.file &&
      existingPackage.image
    ) {
      deleteImageFile(
        existingPackage.image
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Package Updated Successfully",

      package: updatedPackage,
    });
  } catch (error) {
    console.error(
      "UPDATE PACKAGE ERROR:",
      error
    );

    // Remove newly uploaded image if update failed
    if (req.file) {
      deleteImageFile(
        `/uploads/${req.file.filename}`
      );
    }

    return res.status(500).json({
      success: false,

      message: "Server Error",

      error: error.message,
    });
  }
};

// =====================================================
// DELETE PACKAGE
// =====================================================

export const deletePackage = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // =================================================
    // Find package
    // =================================================

    const existingPackage =
      await prisma.package.findUnique({
        where: {
          id,
        },
      });

    if (!existingPackage) {
      return res.status(404).json({
        success: false,

        message: "Package Not Found",
      });
    }

    // =================================================
    // Delete database record
    // =================================================

    await prisma.package.delete({
      where: {
        id,
      },
    });

    // =================================================
    // Delete image
    // =================================================

    if (existingPackage.image) {
      deleteImageFile(
        existingPackage.image
      );
    }

    return res.status(200).json({
      success: true,

      message:
        "Package Deleted Successfully",
    });
  } catch (error) {
    console.error(
      "DELETE PACKAGE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,

      message: "Server Error",

      error: error.message,
    });
  }
};