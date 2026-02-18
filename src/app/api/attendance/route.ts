import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // 共通のクライアントを使用

export const POST = async (req: NextRequest) => {
  const tokenCookie = req.cookies.get("token");
  if (!tokenCookie)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const currentUser = JSON.parse(tokenCookie.value);
  const { subjectId } = await req.json();

  await prisma.attendance.create({
    data: {
      userId: currentUser.id,
      subjectId: subjectId,
    },
  });

  return NextResponse.json({ success: true });
};
