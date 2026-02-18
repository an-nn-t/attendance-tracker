import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // 共通のクライアントを使用

export const POST = async (req: NextRequest) => {
  try {
    const { id, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: { studentNumber: id },
    });

    if (user && user.password === password) {
      const response = NextResponse.json(
        { message: "ログイン成功", role: user.role, userId: user.id },
        { status: 200 },
      );

      const tokenData = JSON.stringify({
        id: user.id,
        role: user.role,
        name: user.name,
        studentNumber: user.studentNumber,
      });

      response.cookies.set("token", tokenData, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { error: "IDまたはパスワードが間違っています" },
      { status: 401 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
};
