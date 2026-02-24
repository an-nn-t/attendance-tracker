// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateAbsenceLimit } from '@/lib/calculations';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'STUDENT' }, // 生徒のみ取得
      include: {
        attendances: {
          where: { isDeleted: false },
          include: {
            subject: {
              include: {
                adjustments: true,
              }
            }
          }
        },
      },
      orderBy: { attendanceNo: 'asc' },
    });

    // 各ユーザーの「残り休める回数（全科目で一番余裕がない科目の回数）」を計算
    const formattedUsers = users.map(user => {
      let minRemainingAbsences = Infinity;

      // ユーザーが受講している（出席記録がついている）科目をグループ化
      const subjectMap = new Map();
      user.attendances.forEach(att => {
        if (!subjectMap.has(att.subjectId)) {
          subjectMap.set(att.subjectId, {
            subject: att.subject,
            absenceCount: 0
          });
        }
        subjectMap.get(att.subjectId).absenceCount += 1; // 1回の欠席で2コマ分消化などルールの詳細次第で調整
      });

      subjectMap.forEach((data) => {
        const { subject, absenceCount } = data;
        
        // 休講・補講の集計
        const canceled = subject.adjustments.filter((a: any) => a.type === 'CANCELED').length;
        const extra = subject.adjustments.filter((a: any) => a.type === 'EXTRA').length;

        const { limit } = calculateAbsenceLimit(subject.credits, subject.isHalfCourse, extra, canceled);
        const remaining = limit - absenceCount;

        if (remaining < minRemainingAbsences) {
          minRemainingAbsences = remaining;
        }
      });

      return {
        id: user.id,
        attendanceNo: user.attendanceNo,
        nickname: user.nickname,
        // まだ欠席がない場合はInfinityになるため、安全な初期値（例:10）等にするかフロントで処理する
        minRemainingAbsences: minRemainingAbsences === Infinity ? 10 : minRemainingAbsences,
        totalAbsences: user.attendances.length,
      };
    });

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}