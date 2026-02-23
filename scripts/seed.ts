import "dotenv/config"
import { prisma } from "../src/lib/prisma"
import bcrypt from "bcryptjs"

async function main() {
  const password = await bcrypt.hash("admin123", 10)

  await prisma.user.create({
    data: {
      attendanceNo: 0,
      nickname: "Admin",
      password,
      role: "ADMIN"
    }
  })

  console.log("Admin created")
}

main()