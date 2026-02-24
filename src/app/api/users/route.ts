import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        attendances: {
          where: { isDeleted: false } // 取消されていない欠席のみ
        },
      },
      orderBy: { attendanceNo: 'asc' } // 出席番号順に並べる
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
