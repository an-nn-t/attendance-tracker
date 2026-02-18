import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  const response = NextResponse.json(
    { message: "ログアウトしました" },
    { status: 200 },
  );

  // クッキーを削除 (有効期限を過去の日付に設定)
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
};
