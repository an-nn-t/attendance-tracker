// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';

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
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 警告対象（残り2回以下）とそれ以外に分ける
  const warningUsers = users.filter(user => user.minRemainingAbsences <= 2);
  const normalUsers = users.filter(user => user.minRemainingAbsences > 2);

  return (
    <main className="min-h-screen p-8 bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">クラス出席状況ボード</h1>
        
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
                  注意: 欠席上限が迫っている生徒
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
                          <span className="text-sm text-red-800 font-medium mr-2">最も危険な科目の残り休める回数:</span>
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
              <h2 className="text-lg font-bold text-slate-600 mb-3">その他の生徒</h2>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <ul className="divide-y divide-slate-100">
                  {normalUsers.map((user) => (
                    <li key={user.id} className="flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-lg text-slate-500 w-16">No. {user.attendanceNo}</span>
                        <span className="text-slate-700">{user.nickname}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-slate-400 mr-2">最小残り回数:</span>
                        <span className="font-semibold text-xl text-slate-700">{user.minRemainingAbsences} 回</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}