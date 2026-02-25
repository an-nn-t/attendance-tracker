// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface User {
  id: string;
  attendanceNo: number;
  nickname: string;
  minRemainingAbsences: number;
  totalAbsences: number;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users');
      if (!response.ok) {
        console.error('API error:', response.status);
        return;
      }
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  // 警告対象（残り2回以下）とそれ以外に分ける
  const warningUsers = users.filter(user => user.minRemainingAbsences <= 2);
  const normalUsers = users.filter(user => user.minRemainingAbsences > 2);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center text-slate-800">【全体共有ビュー】</h1>
        <h2 className="text-2xl font-bold mb-8 text-center text-red-600">クラスのピンチを可視化</h2>
        
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded">
          <p className="text-blue-900">
            <span className="font-bold">📌 このページについて：</span><br/>
            クラス全員の欠席余裕回数をリアルタイム表示しています。<br/>
            プライバシー保護のため、本名ではなく出席番号やニックネームで表示されます。
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500 bg-red-50 p-4 rounded-md border border-red-200">エラー: {error}</p>
        ) : users.length === 0 ? (
          <p className="text-center text-slate-500">データがありません</p>
        ) : (
          <div className="space-y-8">
            {/* 警告表示（全体） */}
            {warningUsers.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-red-600 mb-3 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  ⚠️ 注意: 欠席上限が迫っている生徒（あと2回以下で欠席アウト）
                </h2>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg shadow-sm overflow-hidden">
                  <ul className="divide-y divide-red-100">
                    {warningUsers.map((user) => (
                      <li key={user.id} className="flex justify-between items-center p-4 bg-white/50 hover:bg-white transition-colors">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-lg font-bold text-slate-700 bg-red-100 px-3 py-1 rounded-md">No. {user.attendanceNo}</span>
                          <span className="text-slate-600 font-medium">{user.nickname}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-red-800 font-medium mr-2">最小欠席余裕回数:</span>
                          <span className="font-bold text-2xl text-red-600">{user.minRemainingAbsences} 回</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {/* 通常リスト */}
            <section>
              <h2 className="text-lg font-bold text-slate-600 mb-3">✅ その他の生徒</h2>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-100">
                  {normalUsers.map((user) => (
                    <li key={user.id} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg text-slate-500 w-16">No. {user.attendanceNo}</span>
                        <span className="text-slate-700">{user.nickname}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400 mr-2">欠席余裕回数:</span>
                        <span className="font-semibold text-xl text-green-600">{user.minRemainingAbsences} 回</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* ログイン推奨セクション */}
            <section className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-green-900 mb-4">📱 自分の詳細成績を確認したい方へ</h3>
              <p className="text-green-800 mb-4">
                ログインすると、以下の機能が使えます：
              </p>
              <ul className="text-green-800 space-y-2 mb-6">
                <li>✓ 科目ごとの詳細な出席状況</li>
                <li>✓ 成績逆算機能（合格に必要な点数を自動計算）</li>
                <li>✓ 留年判定アラート</li>
                <li>✓ 個人ダッシュボード</li>
              </ul>
              <div className="flex gap-4">
                <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  🔐 ログイン
                </a>
                <a href="/register" className="px-6 py-3 bg-slate-600 text-white rounded-lg font-bold hover:bg-slate-700 transition-colors">
                  📝 新規登録
                </a>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}