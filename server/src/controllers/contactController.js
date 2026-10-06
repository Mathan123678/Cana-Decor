import prisma from "../config/prisma.js";

// ==========================================
// Create Contact / Enquiry
// ==========================================
export const createContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone, subject and message are required",
      });
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    });

    res.status(201).json({
      success: true,
      message: "Contact Submitted Successfully",
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get All Contacts
// ==========================================
export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Get Contact By ID
// ==========================================
export const getContactById = async (req, res) => {
  try {
    const contact = await prisma.contact.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// Update Contact 
// ==========================================
export const updateContact = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Validate status
    const allowedStatuses = [
      "Pending",
      "Contacted",
      "Resolved",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Use Pending, Contacted, or Resolved",
      });
    }

    // Check contact
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

    // Update only status
    const updatedContact = await prisma.contact.update({
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
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Update Contact Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ==========================================
// Delete Contact
// ==========================================
export const deleteContact = async (req, res) => {
  try {
    const existingContact = await prisma.contact.findUnique({
      where: {
        id: req.params.id,
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
        id: req.params.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Contact Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};