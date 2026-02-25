// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [attendanceNo, setAttendanceNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendanceNo: Number(attendanceNo),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'ログインに失敗しました');
        return;
      }

      // ✅ sessionStorage にトークン保存
      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + 24 * 60 * 60 * 1000);

      sessionStorage.setItem('authToken', data.token);
      sessionStorage.setItem('tokenExpiration', expirationDate.toISOString());

      // ユーザー情報を保存
      sessionStorage.setItem('user', JSON.stringify({
        id: data.user.id,
        attendanceNo: data.user.attendanceNo,
        nickname: data.user.nickname,
        role: data.role,
      }));

      router.push('/dashboard');
    } catch (err) {
      setError('ログイン処理に失敗しました');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          📚 出席管理システム
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              出席番号
            </label>
            <input
              type="number"
              value={attendanceNo}
              onChange={(e) => setAttendanceNo(e.target.value)}
              placeholder="1"
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block animate-spin">⏳</span>
                ログイン中...
              </span>
            ) : (
              'ログイン'
            )}
          </button>
        </form>

        <p className="text-center text-slate-600 mt-6">
          アカウントがない場合は
          <Link href="/signup" className="text-blue-600 font-semibold hover:underline ml-1">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}