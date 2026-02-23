import { verifyToken } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")

  if (!authHeader) {
    return NextResponse.json({ error: "No token" }, { status: 401 })
  }

  const token = authHeader.split(" ")[1]
  const decoded = verifyToken(token) as any

  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  if (decoded.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  return NextResponse.json({ message: "Admin access granted" })
}