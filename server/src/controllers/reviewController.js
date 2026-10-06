import prisma from "../config/prisma.js";

// ==========================================
// Create Review
// ==========================================
export const createReview = async (req, res) => {
  try {
    const { rating, comment, packageId } = req.body;

    // User comes from JWT
    const userId = req.user.id;

    // Validation
    if (
      rating === undefined ||
      !comment ||
      !packageId
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating, comment and packageId are required",
      });
    }

    // Validate rating
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check User
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check Package
    const packageData = await prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });

    if (!packageData) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // Create Review
    const review = await prisma.review.create({
      data: {
        rating: numericRating,
        comment,
        userId,
        packageId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Review Added Successfully",
      review,
    });
  } catch (error) {
    console.error("Create Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get All Reviews
// ==========================================
export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get Review By ID
// ==========================================
export const getReviewById = async (req, res) => {
  try {
    const review = await prisma.review.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: true,
      },
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get Review By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Update Review
// ==========================================
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const reviewId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find Review
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only owner or admin can update
    if (
      existingReview.userId !== userId &&
      userRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this review",
      });
    }

    // Validate rating
    if (rating !== undefined) {
      const numericRating = Number(rating);

      if (
        !Number.isInteger(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
    }

    // Nothing to update
    if (rating === undefined && comment === undefined) {
      return res.status(400).json({
        success: false,
        message: "Provide rating or comment to update",
      });
    }

    const updatedReview = await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        ...(rating !== undefined && {
          rating: Number(rating),
        }),
        ...(comment !== undefined && {
          comment,
        }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        package: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Review Updated Successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Delete Review
// ==========================================
export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Find Review
    const existingReview = await prisma.review.findUnique({
      where: {
        id: reviewId,
      },
    });

    if (!existingReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only owner or admin can delete
    if (
      existingReview.userId !== userId &&
      userRole !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this review",
      });
    }

    await prisma.review.delete({
      where: {
        id: reviewId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};