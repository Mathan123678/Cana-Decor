import prisma from "./src/config/prisma.js";
import { hashPassword } from "./src/utils/hashPassword.js";

const resetAdmin = async () => {
  try {
    const email = "admin@gmail.com";
    const newPassword = "Admin@123";

    const hashedPassword = await hashPassword(newPassword);

    const admin = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("=================================");
    console.log("Admin Password Reset Successfully");
    console.log("Email:", admin.email);
    console.log("Password:", newPassword);
    console.log("Role:", admin.role);
    console.log("=================================");
  } catch (error) {
    console.error("Reset Admin Error:", error);
  } finally {
    await prisma.$disconnect();
  }
};

resetAdmin();