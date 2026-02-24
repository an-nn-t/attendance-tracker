// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { email, password, attendanceNo } = await request.json();
    console.log('Login request:', { email, attendanceNo });

    // Supabaseで認証
    console.log('Authenticating with Supabase...');
    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    console.log('Supabase auth response:', { 
      error: authError?.message, 
      hasSession: !!authData.session 
    });

    if (authError || !authData.session) {
      return NextResponse.json(
        { error: authError?.message || 'ログインに失敗しました' },
        { status: 401 }
      );
    }

    // 出席番号でユーザーを検索
    console.log('Looking up user by attendanceNo:', attendanceNo);
    const user = await prisma.user.findUnique({
      where: { attendanceNo: Number(attendanceNo) },
    });

    console.log('User lookup result:', { found: !!user, role: user?.role });

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      );
    }

    // セッショントークンをCookieにセット
    const cookieStore = await cookies();
    cookieStore.set('supabase-auth-token', authData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7日間
      path: '/',
    });

    return NextResponse.json({
      success: true,
      role: user.role,
      user: {
        id: user.id,
        attendanceNo: user.attendanceNo,
        nickname: user.nickname,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}