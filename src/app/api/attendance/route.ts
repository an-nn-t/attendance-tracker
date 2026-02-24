// src/app/api/attendance/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: '未認証です' }, { status: 401 });

    const decoded = verifyToken(token) as { userId: string } | null;
    if (!decoded) return NextResponse.json({ error: '無効なトークンです' }, { status: 401 });

    const { subjectId, action, date } = await request.json();

    if (action === 'add') {
      await prisma.attendance.create({
        data: {
          userId: decoded.userId,
          subjectId,
          date: new Date(date || new Date()),
        },
      });
    } else if (action === 'remove') {
      // 最新の有効な欠席記録を1件論理削除する
      const latestAttendance = await prisma.attendance.findFirst({
        where: { userId: decoded.userId, subjectId, isDeleted: false },
        orderBy: { createdAt: 'desc' },
      });
      if (latestAttendance) {
        await prisma.attendance.update({
          where: { id: latestAttendance.id },
          data: { isDeleted: true },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Attendance API Error:', error);
    return NextResponse.json({ error: '処理に失敗しました' }, { status: 500 });
  }
}