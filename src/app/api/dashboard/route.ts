// src/app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { calculateAbsenceLimit, calculateRequiredTestScore } from '@/lib/calculations';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: '未認証です' }, { status: 401 });
    }

    const decoded = verifyToken(token) as { userId: string } | null;
    if (!decoded) {
      return NextResponse.json({ error: 'トークンが無効です' }, { status: 401 });
    }

    // ユーザー情報の取得（関連する欠席記録・成績・平常点も同時に取得）
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        attendances: { where: { isDeleted: false } },
        grades: true,
        subjectReports: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // 全科目情報の取得（休講・補講情報含む）
    const subjects = await prisma.subject.findMany({
      include: { adjustments: true },
      orderBy: [{ weekday: 'asc' }, { period: 'asc' }],
    });

    let totalFailedCredits = 0;

    // 各科目の計算処理
    const dashboardData = subjects.map((subject) => {
      // 1. 欠席状況の計算
      const subjectAttendances = user.attendances.filter((a) => a.subjectId === subject.id);
      const absenceCount = subjectAttendances.length;

      const canceled = subject.adjustments.filter((a) => a.type === 'CANCELED').length;
      const extra = subject.adjustments.filter((a) => a.type === 'EXTRA').length;

      const { limit } = calculateAbsenceLimit(subject.credits, subject.isHalfCourse, extra, canceled);
      const remainingAbsences = limit - absenceCount;
      const isAttendanceOut = remainingAbsences < 0;

      // 2. 成績状況の計算
      const subjectGrades = user.grades
        .filter((g) => g.subjectId === subject.id)
        .sort((a, b) => a.testNumber - b.testNumber)
        .map((g) => g.score);
      
      const subjectReportRecord = user.subjectReports.find((r) => r.subjectId === subject.id);
      // 平常点が未入力の場合は、希望的観測として一旦100点で計算（UIで調整可能にするため）
      const expectedReport = subjectReportRecord ? subjectReportRecord.reportScore : 100;

      const requiredScore = calculateRequiredTestScore(
        subject.testWeight,
        subject.reportWeight,
        subject.totalTests,
        subjectGrades,
        expectedReport
      );

      const isGradeOut = requiredScore === null;

      // 3. 単位取得不可（アウト）の判定
      if (isAttendanceOut || isGradeOut) {
        totalFailedCredits += subject.credits;
      }

      return {
        id: subject.id,
        name: subject.name,
        credits: subject.credits,
        absenceCount,
        limit,
        remainingAbsences,
        subjectGrades,
        totalTests: subject.totalTests,
        requiredScore,
        isAttendanceOut,
        isGradeOut,
      };
    });

    return NextResponse.json({
      user: {
        nickname: user.nickname,
        attendanceNo: user.attendanceNo,
      },
      totalFailedCredits,
      subjects: dashboardData,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'データ取得に失敗しました' }, { status: 500 });
  }
}