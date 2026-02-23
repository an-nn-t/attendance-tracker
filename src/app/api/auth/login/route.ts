import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signToken } from "@/lib/auth"

export async function POST(req: Request) {
  const { attendanceNo, password } = await req.json()

  const user = await prisma.user.findUnique({
    where: { attendanceNo }
  })

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return Response.json({ error: "Invalid password" }, { status: 401 })
  }

  const token = signToken({
    id: user.id,
    role: user.role
  })

  return Response.json({ token })
}