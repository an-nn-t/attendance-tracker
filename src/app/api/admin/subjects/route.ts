// src/app/api/admin/subjects/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: '未認証' }, { status: 401 });

    const decoded = verifyToken(token) as { role?: string } | null;
    if (decoded?.role !== 'ADMIN') return NextResponse.json({ error: '権限がありません' }, { status: 403 });

    const data = await request.json();
    
    const subject = await prisma.subject.create({
      data: {
        name: data.name,
        credits: data.credits,
        weekday: data.weekday,
        period: data.period,
        isHalfCourse: data.isHalfCourse,
        testWeight: data.testWeight,
        reportWeight: data.reportWeight,
        totalTests: data.totalTests,
      }
    });

    return NextResponse.json(subject);
  } catch (error) {
    console.error('Subject API Error:', error);
    return NextResponse.json({ error: '保存に失敗しました' }, { status: 500 });
  }
}