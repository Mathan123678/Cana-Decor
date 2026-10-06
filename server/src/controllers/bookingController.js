import prisma from "../config/prisma.js";

// ==========================================
// Create Booking
// Customer / Admin
// ==========================================
export const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      email,
      phone,
      eventType,
      eventDate,
      venue,
      packageId,
    } = req.body;

    const userId = req.user.id;

    // ==========================================
    // Validation
    // ==========================================
    if (
      !customerName ||
      !email ||
      !phone ||
      !eventType ||
      !eventDate ||
      !venue ||
      !packageId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ==========================================
    // Validate Event Date
    // ==========================================
    const parsedEventDate = new Date(eventDate);

    if (isNaN(parsedEventDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid event date",
      });
    }

    // Prevent past bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const bookingDate = new Date(parsedEventDate);
    bookingDate.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: "Event date cannot be in the past",
      });
    }

    // ==========================================
    // Check User
    // ==========================================
    const userExists = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userExists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ==========================================
    // Check Package
    // ==========================================
    const packageExists = await prisma.package.findUnique({
      where: {
        id: packageId,
      },
    });

    if (!packageExists) {
      return res.status(404).json({
        success: false,
        message: "Package not found",
      });
    }

    // ==========================================
    // IMPORTANT
    // Price comes from database
    // Do NOT trust frontend price
    // ==========================================
    const totalAmount = packageExists.price;

    // ==========================================
    // Create Booking
    // ==========================================
    const booking = await prisma.booking.create({
      data: {
        customerName,
        email,
        phone,
        eventType,
        eventDate: parsedEventDate,
        venue,
        totalAmount,
        packageId,
        userId,
        status: "Pending",
      },

      include: {
        package: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Booking Created Successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get Bookings
//
// Customer → Own bookings
// Admin    → All bookings
// ==========================================
export const getBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    const whereCondition =
      userRole === "admin"
        ? {}
        : {
            userId,
          };

    const bookings = await prisma.booking.findMany({
      where: whereCondition,

      include: {
        package: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Get Booking By ID
//
// Customer → Own booking
// Admin    → Any booking
// ==========================================
export const getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },

      include: {
        package: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==========================================
    // Authorization
    // ==========================================
    if (
      req.user.role !== "admin" &&
      booking.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to view this booking",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get Booking By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Update Booking
//
// Customer → Own booking details
// Admin    → Any booking + status
// ==========================================
export const updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // ==========================================
    // Find Existing Booking
    // ==========================================
    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==========================================
    // Authorization
    // ==========================================
    if (
      req.user.role !== "admin" &&
      existingBooking.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this booking",
      });
    }

    const {
      customerName,
      email,
      phone,
      eventType,
      eventDate,
      venue,
      packageId,
      status,
    } = req.body;

    const updateData = {};

    // ==========================================
    // Basic Fields
    // ==========================================

    if (customerName !== undefined) {
      updateData.customerName = customerName;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (eventType !== undefined) {
      updateData.eventType = eventType;
    }

    if (venue !== undefined) {
      updateData.venue = venue;
    }

    // ==========================================
    // Event Date
    // ==========================================

    if (eventDate !== undefined) {
      const parsedEventDate = new Date(eventDate);

      if (isNaN(parsedEventDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid event date",
        });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const bookingDate = new Date(parsedEventDate);
      bookingDate.setHours(0, 0, 0, 0);

      if (bookingDate < today) {
        return res.status(400).json({
          success: false,
          message: "Event date cannot be in the past",
        });
      }

      updateData.eventDate = parsedEventDate;
    }

    // ==========================================
    // Package
    // ==========================================

    if (packageId !== undefined) {
      const packageExists = await prisma.package.findUnique({
        where: {
          id: packageId,
        },
      });

      if (!packageExists) {
        return res.status(404).json({
          success: false,
          message: "Package not found",
        });
      }

      updateData.packageId = packageId;

      // Automatically update price
      // according to selected package
      updateData.totalAmount = packageExists.price;
    }

    // ==========================================
    // STATUS
    //
    // ONLY ADMIN CAN CHANGE STATUS
    // ==========================================

    if (status !== undefined) {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only admin can change booking status",
        });
      }

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Completed",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status. Use Pending, Confirmed, Completed or Cancelled",
        });
      }

      updateData.status = status;
    }

    // ==========================================
    // Nothing To Update
    // ==========================================

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    // ==========================================
    // Update Booking
    // ==========================================

    const updatedBooking = await prisma.booking.update({
      where: {
        id: bookingId,
      },

      data: updateData,

      include: {
        package: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booking Updated Successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Delete Booking
//
// Customer → Own booking
// Admin    → Any booking
// ==========================================
export const deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    // ==========================================
    // Find Booking
    // ==========================================

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ==========================================
    // Authorization
    // ==========================================

    if (
      req.user.role !== "admin" &&
      existingBooking.userId !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this booking",
      });
    }

    // ==========================================
    // Delete
    // ==========================================

    await prisma.booking.delete({
      where: {
        id: bookingId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Booking Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};