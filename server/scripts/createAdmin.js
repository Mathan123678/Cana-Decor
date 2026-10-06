import prisma from "../src/config/prisma.js";
import { hashPassword } from "../src/utils/hashPassword.js";

const createAdmin = async () => {
  try {
    const name = "Daranish";
    const email = "dharaneshjagadeesh@gmail.com";
    const password = "26jaga2005";

    const hashedPassword = await hashPassword(password);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          password: hashedPassword,
          role: "admin",
        },
      });

      console.log("================================");
      console.log("ADMIN ACCOUNT RESET SUCCESSFULLY");
      console.log("================================");
      console.log("Email:", email);
      console.log("Password:", password);
      console.log("Role: admin");
      console.log("================================");

      return;
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "admin",
      },
    });

    console.log("================================");
    console.log("ADMIN CREATED SUCCESSFULLY");
    console.log("================================");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role: admin");
    console.log("================================");

  } catch (error) {
    console.error("Admin Error:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createAdmin();