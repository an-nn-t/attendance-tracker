// src/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

interface UserInfo {
  nickname: string;
  attendanceNo: number;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    name: '', 
    credits: 2, 
    isHalfCourse: false, 
    testWeight: 70, 
    reportWeight: 30, 
    totalTests: 2,
    requiredAbsenceLimit: 4
  });

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      if (userData.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjectForm),
      });
      if (res.ok) {
        alert('科目を追加しました');
        setSubjectForm({
          name: '', 
          credits: 2, 
          isHalfCourse: false, 
          testWeight: 70, 
          reportWeight: 30, 
          totalTests: 2,
          requiredAbsenceLimit: 4
        });
      } else {
        alert('科目追加に失敗しました');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('エラーが発生しました');
    }
    setLoading(false);
  };

  if (!user) {
    return null;
  }

  if (user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">⚙️ 管理者ダッシュボード</h1>
        <p className="text-slate-600 mb-8">科目設定、スケジュール調整、学生データ管理を行います</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 科目登録フォーム */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 text-slate-800">📚 科目登録</h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">科目名 *</label>
                <input 
                  type="text" 
                  placeholder="例：数学1、英語、物理" 
                  required 
                  className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={subjectForm.name} 
                  onChange={e => setSubjectForm({...subjectForm, name: e.target.value})} 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">単位数 *</label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    required 
                    className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={subjectForm.credits} 
                    onChange={e => setSubjectForm({...subjectForm, credits: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">テスト回数 *</label>
                  <input 
                    type="number" 
                    min="1"
                    required 
                    className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={subjectForm.totalTests} 
                    onChange={e => setSubjectForm({...subjectForm, totalTests: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">テスト割合 (%) *</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    required 
                    className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={subjectForm.testWeight} 
                    onChange={e => setSubjectForm({...subjectForm, testWeight: Number(e.target.value)})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">平常点割合 (%) *</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    required 
                    className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    value={subjectForm.reportWeight} 
                    onChange={e => setSubjectForm({...subjectForm, reportWeight: Number(e.target.value)})} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">欠席上限 *</label>
                <input 
                  type="number" 
                  min="1"
                  required 
                  className="w-full border border-slate-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  value={subjectForm.requiredAbsenceLimit} 
                  onChange={e => setSubjectForm({...subjectForm, requiredAbsenceLimit: Number(e.target.value)})} 
                />
                <p className="text-xs text-slate-500 mt-1">通常は総授業回数の1/3を目安にしてください</p>
              </div>

              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200 cursor-pointer">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded"
                  checked={subjectForm.isHalfCourse} 
                  onChange={e => setSubjectForm({...subjectForm, isHalfCourse: e.target.checked})} 
                />
                <div>
                  <span className="font-medium text-slate-700">学修単位</span>
                  <p className="text-xs text-slate-500">必要授業数が半期になる設定</p>
                </div>
              </label>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors font-bold disabled:bg-slate-400"
              >
                {loading ? '登録中...' : '✓ 科目を登録'}
              </button>
            </form>
          </div>

          {/* 管理機能セクション */}
          <div className="space-y-6">
            {/* 科目管理 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">📝 科目管理</h3>
              <div className="space-y-3 text-slate-700">
                <p className="text-sm">登録した科目の以下を管理できます：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>科目名・単位数の変更</li>
                  <li>評価基準（テスト割合・平常点割合）の変更</li>
                  <li>学修単位フラグの設定</li>
                  <li>科目の削除</li>
                </ul>
              </div>
              <button 
                disabled 
                className="mt-4 w-full bg-slate-300 text-slate-600 p-2 rounded cursor-not-allowed opacity-50 font-medium text-sm"
              >
                準備中...
              </button>
            </div>

            {/* スケジュール調整 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">📅 スケジュール調整</h3>
              <div className="space-y-3 text-slate-700">
                <p className="text-sm">休講・補講の情報を登録・管理：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>休講日の登録</li>
                  <li>補講日の登録</li>
                  <li>欠席上限の自動更新</li>
                  <li>学生への通知</li>
                </ul>
              </div>
              <button 
                disabled 
                className="mt-4 w-full bg-slate-300 text-slate-600 p-2 rounded cursor-not-allowed opacity-50 font-medium text-sm"
              >
                準備中...
              </button>
            </div>

            {/* 学生データ管理 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">👥 学生データ管理</h3>
              <div className="space-y-3 text-slate-700">
                <p className="text-sm">学生情報の一括管理：</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>全学生一覧表示</li>
                  <li>学生情報の編集・削除</li>
                  <li>パスワードリセット</li>
                  <li>データエクスポート</li>
                </ul>
              </div>
              <button 
                disabled 
                className="mt-4 w-full bg-slate-300 text-slate-600 p-2 rounded cursor-not-allowed opacity-50 font-medium text-sm"
              >
                準備中...
              </button>
            </div>
          </div>
        </div>

        {/* 情報セクション */}
        <div className="mt-8 bg-blue-50 rounded-lg shadow-lg p-6 border-l-4 border-blue-600">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📖 管理者機能について</h3>
          <div className="text-blue-800 space-y-3">
            <p>
              <span className="font-bold">柔軟なシラバス対応：</span>
              科目ごとに異なるテスト割合、平常点割合、欠席上限を登録できます。
            </p>
            <p>
              <span className="font-bold">学修単位への対応：</span>
              学修単位フラグを設定すると、必要授業回数が自動で半期計算されます。
            </p>
            <p>
              <span className="font-bold">スケジュール自動更新：</span>
              休講・補講情報は学生の欠席上限計算に自動的に反映されます。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}