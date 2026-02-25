import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { attendanceNo, nickname, password, passwordConfirm } = await request.json();

    // バリデーション
    if (!attendanceNo || !nickname || !password || !passwordConfirm) {
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      );
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'パスワード確認が一致しません' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上である必要があります' },
        { status: 400 }
      );
    }

    // ✅ 出席番号の重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { attendanceNo: Number(attendanceNo) },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'この出席番号は既に登録されています' },
        { status: 400 }
      );
    }

    // ✅ Supabase Auth でユーザーを作成
    const email = `user_${attendanceNo}@attendance-tracker.local`;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // メール確認をスキップ
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: 'ユーザー作成に失敗しました' },
        { status: 400 }
      );
    }

    // ✅ Prisma でユーザーレコードを作成
    const user = await prisma.user.create({
      data: {
        id: authData.user.id,
        attendanceNo: Number(attendanceNo),
        nickname,
        password: '', // Supabase Auth が管理
        email,
        role: 'STUDENT',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'ユーザー登録が完了しました。ログインしてください。',
        user: {
          id: user.id,
          attendanceNo: user.attendanceNo,
          nickname: user.nickname,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'この出席番号は既に登録されています' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'ユーザー登録に失敗しました' },
      { status: 500 }
    );
  }
}