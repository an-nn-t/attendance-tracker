'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    attendanceNo: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // パスワード確認
    if (formData.password !== formData.confirmPassword) {
      setError('パスワードが一致しません');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendanceNo: formData.attendanceNo,
          nickname: formData.nickname,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // エラーメッセージを詳細に表示
        if (res.status === 429) {
          setError('メール送信がレート制限されています。しばらく時間をおいて再度お試しください。');
        } else {
          setError(data.error || 'ユーザー登録に失敗しました');
        }
        setLoading(false);
        return;
      }

      // 成功メッセージを表示
      setSuccess('ユーザー登録が完了しました。ログインしてください。');
      setError('');
      
      // 2秒後にログインページへリダイレクト
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-200">
          <h1 className="text-2xl font-bold mb-6 text-center text-slate-800">📝 ユーザー登録</h1>
          
          {success && <div className="bg-green-50 text-green-600 text-sm p-3 rounded mb-4">{success}</div>}
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">出席番号</label>
              <input
                type="number"
                name="attendanceNo"
                value={formData.attendanceNo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="例: 1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ニックネーム</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="太郎"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="example@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">パスワード</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">パスワード（確認）</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 text-white py-2 px-4 rounded-md hover:bg-slate-700 transition-colors font-medium disabled:bg-slate-400"
            >
              {loading ? '登録中...' : '登録'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            既にアカウントをお持ちですか？{' '}
            <Link href="/login" className="text-slate-800 font-medium hover:underline">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
