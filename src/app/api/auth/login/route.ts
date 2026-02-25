// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { attendanceNo, password } = await request.json();

    if (!attendanceNo || !password) {
      return NextResponse.json(
        { message: '出席番号とパスワードは必須です' },
        { status: 400 }
      );
    }

    // ✅ Prisma でユーザーを検索
    const user = await prisma.user.findUnique({
      where: { attendanceNo: Number(attendanceNo) },
    });

    if (!user) {
      return NextResponse.json(
        { message: '出席番号またはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // ✅ Supabase Auth でログイン
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email: user.email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json(
        { message: 'ログイン処理に失敗しました' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: user.id,
          attendanceNo: user.attendanceNo,
          nickname: user.nickname,
        },
        role: user.role,
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': [
            `access_token=${data.session.access_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${data.session.expires_in}`,
            `refresh_token=${data.session.refresh_token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
          ].join(', '),
        },
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'ログイン処理に失敗しました' },
      { status: 500 }
    );
  }
}