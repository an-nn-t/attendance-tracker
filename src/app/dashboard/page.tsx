// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface UserInfo {
  nickname: string;
  attendanceNo: number;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        // ✅ sessionStorage からトークン取得
        const authToken = sessionStorage.getItem('authToken');
        const userData = sessionStorage.getItem('user');

        if (!authToken || !userData) {
          router.push('/login');
          return;
        }

        // トークンがまだ有効か確認
        const expiration = sessionStorage.getItem('tokenExpiration');
        if (expiration && new Date(expiration) < new Date()) {
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('user');
          sessionStorage.removeItem('tokenExpiration');
          router.push('/login');
          return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);
      } catch (error) {
        console.error('Session check failed:', error);
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-slate-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* ウェルカムセクション */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">👋 ようこそ、{user.nickname}さん</h1>
          <p className="text-blue-100">出席番号: {user.attendanceNo}（{user.role === 'ADMIN' ? '👨‍💼 管理者' : '👨‍🎓 学生'}）</p>
        </div>

        {/* 留年アラートセクション */}
        <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8 rounded">
          <h3 className="font-bold text-red-900 mb-2">⚠️ 留年判定アラート</h3>
          <p className="text-red-800">
            このセクションでは、欠席上限が近づいた科目や、落単確定で8単位以上になった場合に重大な警告が表示されます。
          </p>
        </div>

        {/* メニューセクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 出席管理 */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <Link href="/attendance" prefetch={false} className="block p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">📋 出席管理</h3>
              <p className="text-slate-600 mb-4">
                科目ごとの出席状況を確認し、欠席上限までの余裕をチェック
              </p>
              <div className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                詳細を見る
              </div>
            </Link>
          </div>

          {/* 成績確認＆成績逆算 */}
          <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <Link href="/grades" prefetch={false} className="block p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-3">📊 成績確認</h3>
              <p className="text-slate-600 mb-4">
                テスト成績を管理し、合格に必要な目標点数を自動計算
              </p>
              <div className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
                詳細を見る
              </div>
            </Link>
          </div>
        </div>

        {/* 成績逆算機能の説明 */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-green-900 mb-4">🎯 成績逆算機能について</h3>
          <div className="space-y-3 text-green-800">
            <p>
              <span className="font-bold">機能説明：</span> 現在のテスト点数と平常点（自己評価）を入力すると、総合評価で60点をクリアするために、次回のテストで何点必要かを自動計算します。
            </p>
            <p>
              <span className="font-bold">使い方：</span>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>科目のテスト成績を入力</li>
              <li>平常点を入力</li>
              <li>システムが自動で必要な次のテスト目標点を提示</li>
            </ul>
          </div>
        </div>

        {/* 管理者メニュー */}
        {user.role === 'ADMIN' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold text-yellow-900 mb-4">🔧 管理者メニュー</h3>
            <p className="text-yellow-800 mb-4">
              科目設定、スケジュール調整、学生データ管理ができます。
            </p>
            <Link
              href="/admin"
              prefetch={false}
              className="inline-block bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 transition-colors font-bold"
            >
              管理パネルへ
            </Link>
          </div>
        )}

        {/* 情報セクション */}
        <div className="bg-blue-50 rounded-lg shadow p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">ℹ️ このアプリについて</h3>
          <ul className="text-blue-800 space-y-2">
            <li>✓ 科目ごとの欠席状況をリアルタイムで管理して、留年リスクを未然に防止</li>
            <li>✓ 成績逆算機能で、合格に必要な目標点数を自動計算</li>
            <li>✓ クラス全体との情報共有により、互いにサポートし合うことを促進</li>
            <li>✓ 管理者による柔軟なシラバス・時間割対応</li>
          </ul>
        </div>
      </div>
    </div>
  );
}