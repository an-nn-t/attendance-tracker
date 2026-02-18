import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // 共通のクライアントを使用

export const GET = async (req: NextRequest) => {
  const tokenCookie = req.cookies.get("token");
  let currentUser = null;
  if (tokenCookie) {
    try {
      currentUser = JSON.parse(tokenCookie.value);
    } catch (e) {}
  }

  const users = await prisma.user.findMany({
    include: { attendances: true, scores: true },
    where: { role: "STUDENT" },
  });
  const subjects = await prisma.subject.findMany();

  const formattedUsers = users.map((user) => {
    let lostCredits = 0;

    const subjectStatuses = subjects.map((sub) => {
      const actualTotal =
        sub.baseTotalClasses - sub.cancelledClasses + sub.makeupClasses;
      const allowedAbsences = Math.floor(actualTotal / 3);

      const absences = user.attendances.filter(
        (a) => a.subjectId === sub.id,
      ).length;
      const remaining = allowedAbsences - absences;

      if (remaining < 0) lostCredits += sub.units;

      return {
        subjectId: sub.id,
        absences,
        remaining,
        isDanger: remaining <= 3,
        isCritical: remaining < 0,
        currentScore: null,
        neededScore: null,
      };
    });

    return {
      user: { id: user.id, name: user.name, studentNumber: user.studentNumber },
      subjects: subjectStatuses,
      totalCreditsLost: lostCredits,
    };
  });

  return NextResponse.json({
    currentUser,
    subjects,
    users: formattedUsers,
  });
};
