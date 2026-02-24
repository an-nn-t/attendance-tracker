// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt'; // もしビルドエラーが出た場合は 'bcryptjs' を使用してください
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { attendanceNo, password } = await request.json();

    // ユーザー検索
    const user = await prisma.user.findUnique({
      where: { attendanceNo: Number(attendanceNo) },
    });

    if (!user) {
      return NextResponse.json({ error: 'ユーザーが見つかりません' }, { status: 404 });
    }

    // パスワード照合
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'パスワードが間違っています' }, { status: 401 });
    }

    // JWT生成
    const token = signToken({
      userId: user.id,
      attendanceNo: user.attendanceNo,
      role: user.role,
    });

    // Cookieにセット
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    });

    return NextResponse.json({ success: true, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}