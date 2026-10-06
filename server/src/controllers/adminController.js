import prisma from "../config/prisma.js";

// ==========================================
// Get Admin Dashboard Statistics
// ==========================================
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();

    const totalPackages = await prisma.package.count();

    const totalBookings = await prisma.booking.count();

    const totalGallery = await prisma.gallery.count();

    const totalReviews = await prisma.review.count();

    const totalContacts = await prisma.contact.count();

    // Pending Bookings
    const pendingBookings = await prisma.booking.count({
      where: {
        status: "Pending",
      },
    });

    // Pending Contacts
    const pendingContacts = await prisma.contact.count({
      where: {
        status: "Pending",
      },
    });

    // Total Revenue
    const revenueResult = await prisma.booking.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: "Cancelled",
        },
      },
    });

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    return res.status(200).json({
      success: true,
      dashboard: {
        totalUsers,
        totalPackages,
        totalBookings,
        totalGallery,
        totalReviews,
        totalContacts,
        pendingBookings,
        pendingContacts,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get All Users
// ==========================================
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get All Users Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get User By ID
// ==========================================
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        bookings: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get User By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Delete User
// ==========================================
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get All Bookings
// ==========================================
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
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
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get Booking By ID
// ==========================================
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
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

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
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
      error: error.message,
    });
  }
};

// ==========================================
// Update Booking Status
// ==========================================
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
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
          "Invalid status. Use Pending, Confirmed, Completed, or Cancelled",
      });
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const booking = await prisma.booking.update({
      where: {
        id,
      },
      data: {
        status,
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
      message: "Booking Status Updated Successfully",
      booking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Delete Booking
// ==========================================
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await prisma.booking.delete({
      where: {
        id,
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
      error: error.message,
    });
  }
};

// ==========================================
// Get All Contacts
// ==========================================
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get All Contacts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Get Contact By ID
// ==========================================
export const getContactById = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error("Get Contact By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Update Contact Status
// ==========================================
export const updateContactStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const allowedStatuses = [
      "Pending",
      "Contacted",
      "Resolved",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use Pending, Contacted, or Resolved",
      });
    }

    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    const contact = await prisma.contact.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contact Status Updated Successfully",
      contact,
    });
  } catch (error) {
    console.error("Update Contact Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ==========================================
// Delete Contact
// ==========================================
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const existingContact = await prisma.contact.findUnique({
      where: {
        id,
      },
    });

    if (!existingContact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    await prisma.contact.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Contact Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};