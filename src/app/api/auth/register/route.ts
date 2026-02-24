import { prisma } from "@/lib/prisma"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { attendanceNo, nickname, password } = await req.json()

  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      attendanceNo,
      nickname,
      password: hashed,
      role: "STUDENT", // ← 学生固定でOK
    },
  })

  return NextResponse.json(user)
}