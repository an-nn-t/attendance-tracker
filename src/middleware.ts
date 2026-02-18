import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  // ミドルウェアを適用するパスのパターン
  matcher: ["/admin/:path*"],
};

export function middleware(request: NextRequest) {
  // クッキーからトークンを取得
  const token = request.cookies.get("token");

  // トークンが存在しない場合 (未ログイン)
  if (!token) {
    // ログインページへのURLを作成
    const loginUrl = new URL("/login", request.url);
    
    // リダイレクト
    return NextResponse.redirect(loginUrl);
  }

  // トークンが存在する場合 (ログイン済み) はそのまま処理を続行
  return NextResponse.next();
}
