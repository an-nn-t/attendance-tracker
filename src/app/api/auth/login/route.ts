import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { id, password } = await req.json();

    // 簡易的な認証 (本来はDBなどで管理すべき)
    // ID: admin, Password: password
    if (id === "admin" && password === "password") {
      const response = NextResponse.json(
        { message: "ログイン成功" },
        { status: 200 },
      );

      // クッキーを設定 (有効期限は1日とする)
      // httpOnly: true にすることでJavaScriptからのアクセスを防ぐ
      response.cookies.set("token", "admin-token", {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1日
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
      { error: "ログイン処理に失敗しました" },
      { status: 500 },
    );
  }
};
