import { prisma } from "@/lib/prisma"
import { supabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { attendanceNo, nickname, email, password } = await req.json()
    console.log('Register request:', { attendanceNo, nickname, email })

    // バリデーション
    if (!attendanceNo || !nickname || !email || !password) {
      console.log('Validation failed:', { attendanceNo, nickname, email, password })
      return NextResponse.json(
        { error: '必須項目が不足しています' },
        { status: 400 }
      )
    }

    // 出席番号の重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { attendanceNo: Number(attendanceNo) },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'この出席番号は既に登録されています' },
        { status: 400 }
      )
    }

    // Supabaseで認証ユーザーを作成
    console.log('Creating Supabase user:', email)
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    console.log('Supabase response:', { authError: authError?.message, user: authData.user?.id })

    if (authError) {
      console.error('Supabase error:', authError)
      
      // レート制限エラーを返す
      if (authError.message?.includes('rate limit') || authError.message?.includes('Too many')) {
        return NextResponse.json(
          { error: 'メール送信がレート制限されています。しばらく時間をおいて再度お試しください。' },
          { status: 429 }
        )
      }
      
      // その他のエラーを返す
      return NextResponse.json(
        { error: authError.message || 'ユーザー作成に失敗しました' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'ユーザー作成に失敗しました' },
        { status: 400 }
      )
    }

    // Prismaでユーザーレコードを作成
    const user = await prisma.user.create({
      data: {
        attendanceNo: Number(attendanceNo),
        nickname,
        password, // プレーンテキストで保存（Supabaseで管理）
        role: "STUDENT",
      },
    })

    return NextResponse.json({
      success: true,
      message: 'ユーザー登録が完了しました。ログインしてください。',
      user: {
        id: user.id,
        attendanceNo: user.attendanceNo,
        nickname: user.nickname,
      },
    })
  } catch (error: any) {
    console.error('Registration error:', error)
    
    // 出席番号が既に登録されている場合
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'この出席番号は既に登録されています' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || 'ユーザー登録に失敗しました' },
      { status: 500 }
    )
  }
}