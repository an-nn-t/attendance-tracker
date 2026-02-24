// src/app/api/grades/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: '未認証' }, { status: 401 });

    const decoded = verifyToken(token) as { userId: string } | null;
    if (!decoded) return NextResponse.json({ error: '無効なトークン' }, { status: 401 });

    const { subjectId, type, testNumber, score, reportScore } = await request.json();

    if (type === 'test') {
      // テスト点数の更新または作成
      await prisma.grade.upsert({
        where: {
          userId_subjectId_testNumber: {
            userId: decoded.userId,
            subjectId,
            testNumber,
          }
        },
        update: { score },
        create: {
          userId: decoded.userId,
          subjectId,
          testNumber,
          score,
        }
      });
    } else if (type === 'report') {
      // 平常点の更新または作成
      await prisma.subjectReport.upsert({
        where: {
          userId_subjectId: {
            userId: decoded.userId,
            subjectId,
          }
        },
        update: { reportScore },
        create: {
          userId: decoded.userId,
          subjectId,
          reportScore,
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Grades API Error:', error);
    return NextResponse.json({ error: '処理に失敗しました' }, { status: 500 });
  }
}